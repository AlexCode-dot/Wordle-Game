import { Request, Response, NextFunction } from 'express'
import * as gameSessionService from '../services/gameSessionService'
import * as guessService from '../services/guessService'
import initGame from '../services/initGame'
import { API, GuessResult } from '../types'

export const startGame = (api: API) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { wordLength, noLetterDuplicate } = req.body
      const gameSettings = {
        wordLength: Number(wordLength),
        noLetterDuplicate: Boolean(noLetterDuplicate),
      }

      const gameStatus = await initGame(api, gameSettings)

      if (!gameStatus.gameStarted || !gameStatus.correctWord) {
        return res.status(400).json({ message: gameStatus.message, gameStarted: false })
      }

      gameSessionService.startNewGame(req, { correctWord: gameStatus.correctWord }, gameSettings)

      return res.status(201).json({
        wordLength: gameStatus.wordLength,
        gameStarted: true,
      })
    } catch (err) {
      next(err)
    }
  }
}

export const getWordLengths = (api: API) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const words = await api.loadWords()
      const wordLengths = [...new Set(words.map((word) => word.length))].sort((a, b) => a - b)
      return res.json(wordLengths)
    } catch (err) {
      next(err)
    }
  }
}

export const makeGuess = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { guessedWord } = req.body

    if (!guessedWord || typeof guessedWord !== 'string') {
      return res.status(400).json({ error: 'Invalid input. A valid guessed word (string) is required.' })
    }

    if (!req.session.game || !req.session.game.correctWord) {
      return res.status(400).json({ error: 'No active game session.' })
    }

    const guessResult = guessService.handleGuess(guessedWord, req.session.game)

    if ('error' in guessResult) {
      return res.status(400).json({ error: guessResult.error })
    }

    const result: GuessResult = guessResult

    gameSessionService.saveGuess(req, result.feedback, result.gameWon, result.timeTaken)

    req.session.save((err) => {
      if (err) {
        console.error('Failed to save session:', err)
        return next(err)
      }

      const { feedback, gameWon, timeTaken } = result
      return res.json({ letterFeedback: feedback, gameWon, ...(gameWon ? { timeTaken } : {}) })
    })
  } catch (err) {
    next(err)
  }
}

export const revealCorrectWord = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    if (!req.session.game) {
      return res.status(400).json({ error: 'No active game session.' })
    }

    const correctWord = req.session.game.correctWord

    gameSessionService.destroySession(req)

    return res.json(correctWord)
  } catch (err) {
    next(err)
  }
}

export const getGameStatus = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const game = gameSessionService.retrieveSessionGameStatus(req)

    if (!game) {
      return res.json({ gameStarted: false })
    }

    const { rules, guesses, state = 'playing', winningFeedback = null, timeTaken } = game

    const response: Record<string, unknown> = {
      gameStarted: true,
      rules,
      guesses,
      state,
      winningFeedback: state === 'win' ? winningFeedback : null,
    }

    if (state === 'win' && timeTaken != null) {
      response.timeTaken = timeTaken
    }

    return res.json(response)
  } catch (err) {
    next(err)
  }
}

export const deleteGameSession = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    if (req.session?.game) {
      gameSessionService.destroySession(req)
      return res.status(200).json({ message: 'Game session removed.' })
    } else {
      return res.status(200).json({ message: 'No game session found.' })
    }
  } catch (err) {
    next(err)
  }
}

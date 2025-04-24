import * as gameSessionService from '../services/gameSessionService'
import * as guessService from '../services/guessService'
import initGame from '../services/initGame'
import {
  API,
  GuessResult,
  InitGameResult,
  GameRules,
  GuessResponse,
  GameStatusResponse,
  RevealWordResponse,
  AsyncRouteHandler,
  WordLanguage,
  WordSource,
} from '../types'

export const startGame =
  (api: API): AsyncRouteHandler =>
  async (req, res, next) => {
    try {
      const { wordLength, noLetterDuplicate, language } = req.body

      const gameSettings: GameRules = {
        wordLength: Number(wordLength),
        noLetterDuplicate: Boolean(noLetterDuplicate),
        language,
      }

      const gameStatus: InitGameResult = await initGame(api, gameSettings)

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

export const getWordLengths =
  (api: API): AsyncRouteHandler =>
  async (req, res, next) => {
    try {
      const lang = req.query.lang as WordLanguage
      const source = process.env.WORD_SOURCE as WordSource

      const words = await api.loadWords(source, lang)

      const wordLengths = [...new Set(words.map((word) => word.length))].sort((a, b) => a - b)
      return res.json(wordLengths)
    } catch (err) {
      next(err)
    }
  }

export const makeGuess: AsyncRouteHandler = async (req, res, next) => {
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

      const response: GuessResponse = {
        letterFeedback: result.feedback,
        gameWon: result.gameWon,
        ...(result.gameWon && result.timeTaken ? { timeTaken: result.timeTaken } : {}),
      }

      return res.json(response)
    })
  } catch (err) {
    next(err)
  }
}

export const revealCorrectWord: AsyncRouteHandler = async (req, res, next) => {
  try {
    if (!req.session.game) {
      return res.status(400).json({ error: 'No active game session.' })
    }

    const correctWord = req.session.game.correctWord

    gameSessionService.destroySession(req, (err) => {
      if (err) {
        return next(err)
      }

      const response: RevealWordResponse = { correctWord }
      return res.json(response)
    })
  } catch (err) {
    next(err)
  }
}

export const getGameStatus =
  (dbConnected: boolean): AsyncRouteHandler =>
  async (req, res, next) => {
    try {
      const game = gameSessionService.retrieveSessionGameStatus(req)

      if (!game) {
        return res.json({ gameStarted: false, dbConnected })
      }

      const { rules, guesses, state = 'playing', winningFeedback = null, timeTaken } = game

      const response: GameStatusResponse & { dbConnected: boolean } = {
        gameStarted: true,
        rules,
        guesses,
        state,
        winningFeedback: state === 'win' ? winningFeedback : null,
        ...(state === 'win' && timeTaken ? { timeTaken } : {}),
        dbConnected,
      }

      return res.json(response)
    } catch (err) {
      next(err)
    }
  }

export const deleteGameSession: AsyncRouteHandler = async (req, res, next) => {
  try {
    if (req.session?.game) {
      gameSessionService.destroySession(req, (err) => {
        if (err) {
          return next(err)
        }

        return res.status(200).json({ message: 'Game session removed.' })
      })
    } else {
      return res.status(200).json({ message: 'No game session found.' })
    }
  } catch (err) {
    next(err)
  }
}

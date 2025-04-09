import * as gameSessionService from '../services/gameSessionService.js'
import * as guessService from '../services/guessService.js'
import initGame from '../services/initGame.js'

export const startGame = (api) => async (req, res, next) => {
  try {
    const { wordLength, noLetterDuplicate } = req.body
    const gameSettings = {
      wordLength: Number(wordLength),
      noLetterDuplicate: Boolean(noLetterDuplicate),
    }

    const gameStatus = await initGame(api, gameSettings)

    if (!gameStatus.gameStarted) {
      return res.status(400).json({ message: gameStatus.message, gameStarted: false })
    }

    gameSessionService.startNewGame(req, gameStatus, gameSettings)

    res.status(201).json({
      wordLength: gameStatus.wordLength,
      gameStarted: true,
    })
  } catch (err) {
    next(err)
  }
}

export const getWordLengths = (api) => async (req, res, next) => {
  try {
    const words = await api.loadWords()
    const wordLengths = [...new Set(words.map((word) => word.length))].sort((a, b) => a - b)
    res.json(wordLengths)
  } catch (err) {
    next(err)
  }
}

export const makeGuess = (req, res, next) => {
  try {
    const { guessedWord } = req.body

    if (!guessedWord || typeof guessedWord !== 'string') {
      return res.status(400).json({ error: 'Invalid input. A valid guessed word (string) is required.' })
    }

    if (!req.session.game || !req.session.game.correctWord) {
      return res.status(400).json({ error: 'No active game session.' })
    }

    const result = guessService.handleGuess(guessedWord, req.session.game)

    if (result.error) {
      return res.status(400).json({ error: result.error })
    }

    gameSessionService.saveGuess(req, result.feedback, result.gameWon, result.timeTaken)

    req.session.save((err) => {
      if (err) {
        console.error('Failed to save session:', err)
        return next(err)
      }

      const { feedback, gameWon, timeTaken } = result
      res.json({ letterFeedback: feedback, gameWon, ...(gameWon ? { timeTaken } : {}) })
    })
  } catch (err) {
    next(err)
  }
}

export const revealCorrectWord = (req, res, next) => {
  try {
    const correctWord = req.session.game?.correctWord

    gameSessionService.destroySession(req)

    res.json(correctWord)
  } catch (err) {
    next(err)
  }
}

export const getGameStatus = (req, res, next) => {
  try {
    const game = gameSessionService.retrieveSessionGameStatus(req)

    if (!game) {
      return res.json({ gameStarted: false })
    }

    const { rules, guesses, state = 'playing', winningFeedback = null } = game

    return res.json({
      gameStarted: true,
      rules,
      guesses,
      state,
      winningFeedback: state === 'win' ? winningFeedback : null,
    })
  } catch (err) {
    next(err)
  }
}

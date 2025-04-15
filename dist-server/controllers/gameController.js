'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = []
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k
          return ar
        }
      return ownKeys(o)
    }
    return function (mod) {
      if (mod && mod.__esModule) return mod
      var result = {}
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== 'default') __createBinding(result, mod, k[i])
      __setModuleDefault(result, mod)
      return result
    }
  })()
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.deleteGameSession =
  exports.getGameStatus =
  exports.revealCorrectWord =
  exports.makeGuess =
  exports.getWordLengths =
  exports.startGame =
    void 0
const gameSessionService = __importStar(require('../services/gameSessionService'))
const guessService = __importStar(require('../services/guessService'))
const initGame_1 = __importDefault(require('../services/initGame'))
const startGame = (api) => {
  return async (req, res, next) => {
    try {
      const { wordLength, noLetterDuplicate } = req.body
      const gameSettings = {
        wordLength: Number(wordLength),
        noLetterDuplicate: Boolean(noLetterDuplicate),
      }
      const gameStatus = await (0, initGame_1.default)(api, gameSettings)
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
exports.startGame = startGame
const getWordLengths = (api) => {
  return async (req, res, next) => {
    try {
      const words = await api.loadWords()
      const wordLengths = [...new Set(words.map((word) => word.length))].sort((a, b) => a - b)
      return res.json(wordLengths)
    } catch (err) {
      next(err)
    }
  }
}
exports.getWordLengths = getWordLengths
const makeGuess = async (req, res, next) => {
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
    const result = guessResult
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
exports.makeGuess = makeGuess
const revealCorrectWord = async (req, res, next) => {
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
exports.revealCorrectWord = revealCorrectWord
const getGameStatus = async (req, res, next) => {
  try {
    const game = gameSessionService.retrieveSessionGameStatus(req)
    if (!game) {
      return res.json({ gameStarted: false })
    }
    const { rules, guesses, state = 'playing', winningFeedback = null, timeTaken } = game
    const response = {
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
exports.getGameStatus = getGameStatus
const deleteGameSession = async (req, res, next) => {
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
exports.deleteGameSession = deleteGameSession

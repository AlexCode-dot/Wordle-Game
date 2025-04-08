import * as gameSessionService from '../services/gameSessionService.js'
import initGame from '../services/initGame.js'
import wordFeedBack from '../services/wordFeedback.js'

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

    // Move the session logic to the gameSessionService
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

    const correctWord = req.session.game.correctWord
    const feedback = wordFeedBack(guessedWord, correctWord)

    if (feedback === false) {
        return res.status(400).json({ error: 'Your guess was not valid, try another word.' })
    }

    gameSessionService.saveGuess(req, feedback)
    
    res.json(feedback)
  } catch (err) {
    next(err)
  }
}

export const revealCorrectWord = (req, res, next) => {
  try {
    const correctWord = req.session.game?.correctWord

    // Use the gameSessionService to destroy the session
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
      next(err) // Pass it to your centralized error handler
    }
  }
  

import express from 'express'
import initGame from '../services/initGame.js'
import wordFeedBack from '../services/wordFeedback.js'

const router = express.Router()

let gameData = '' //Simulate database data

export default function apiRoutes(api) {
  router.post('/start-game', async (req, res, next) => {
    try {
      const { wordLength, noLetterDuplicate } = req.body

      const gameSettings = {
        wordLength: Number(wordLength),
        noLetterDuplicate: Boolean(noLetterDuplicate),
      }

      const gameStatus = await initGame(api, gameSettings)
      gameData = gameStatus.correctWord //Simulate database data

      res.status(201).json({
        wordLength: gameStatus.wordLength,
        gameStarted: gameStatus.gameStarted,
      })
    } catch (err) {
      next(err)
    }
  })

  router.get('/word-lengths', async (req, res, next) => {
    try {
      const words = await api.loadWords()
      const wordLengths = [...new Set(words.map((word) => word.length))]
      wordLengths.sort((a, b) => a - b)
      res.json(wordLengths)
    } catch (err) {
      next(err)
    }
  })

  //TEST
  router.post('/guess', (req, res, next) => {
    try {
      const { guessedWord } = req.body

      if (!guessedWord || typeof guessedWord !== 'string') {
        return res.status(400).json({ error: 'Invalid input. A valid guessed word (string) is required.' })
      }

      const correctWord = gameData //Simulate database data
      const feedback = wordFeedBack(guessedWord, correctWord)
      res.json(feedback)
    } catch (err) {
      next(err)
    }
  })

  router.get('/correct-word', async (req, res, next) => {
    try {
      res.json(gameData) //Simulate database data
    } catch (err) {
      next(err)
    }
  })

  return router
}

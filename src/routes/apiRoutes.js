import express from 'express'
import * as gameController from '../controllers/gameController.js'
import * as scoreController from '../controllers/scoreController.js'

const router = express.Router()

export default function apiRoutes(api) {
  router.post('/games', gameController.startGame(api))
  router.get('/words/lengths', gameController.getWordLengths(api))
  router.post('/games/guesses', gameController.makeGuess)
  router.get('/games/correct-word', gameController.revealCorrectWord)
  router.get('/games/status', gameController.getGameStatus)
  router.post('/submit-score', scoreController.submitScore(api))

  return router
}

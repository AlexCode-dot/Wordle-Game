import express from 'express'
import * as gameController from '../controllers/gameController'
import * as scoreController from '../controllers/scoreController'
import { AppOptions, AsyncRouteHandler } from '../types'

const router = express.Router()

export default function apiRoutes({ api, dbConnected }: AppOptions) {
  router.post('/games', gameController.startGame(api) as AsyncRouteHandler)
  router.delete('/games', gameController.deleteGameSession as AsyncRouteHandler)
  router.get('/words/lengths', gameController.getWordLengths(api) as AsyncRouteHandler)
  router.post('/games/guesses', gameController.makeGuess as AsyncRouteHandler)
  router.get('/games/correct-word', gameController.revealCorrectWord as AsyncRouteHandler)
  router.get('/games/status', gameController.getGameStatus(dbConnected) as AsyncRouteHandler)
  router.post('/submit-score', scoreController.submitScore(api) as AsyncRouteHandler)

  return router
}

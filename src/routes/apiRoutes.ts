import express, { Request, Response, NextFunction } from 'express'
import * as gameController from '../controllers/gameController'
import * as scoreController from '../controllers/scoreController'
import { API } from '../types'

const router = express.Router()

export default function apiRoutes(api: API): express.Router {
  router.post('/games', gameController.startGame(api) as (req: Request, res: Response, next: NextFunction) => void)
  router.delete('/games', gameController.deleteGameSession as (req: Request, res: Response, next: NextFunction) => void)
  router.get(
    '/words/lengths',
    gameController.getWordLengths(api) as (req: Request, res: Response, next: NextFunction) => void
  )
  router.post('/games/guesses', gameController.makeGuess as (req: Request, res: Response, next: NextFunction) => void)
  router.get(
    '/games/correct-word',
    gameController.revealCorrectWord as (req: Request, res: Response, next: NextFunction) => void
  )
  router.get('/games/status', gameController.getGameStatus as (req: Request, res: Response, next: NextFunction) => void)
  router.post(
    '/submit-score',
    scoreController.submitScore(api) as (req: Request, res: Response, next: NextFunction) => void
  )

  return router
}

import { Request, Response, NextFunction } from 'express'
import * as gameSessionService from '../services/gameSessionService'
import * as scoreService from '../services/scoreService'
import { API } from '../types'

export const submitScore =
  (api: API) =>
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { name } = req.body

      const game = req.session.game

      if (!game) {
        return res.status(400).json({ error: 'No game session found.' })
      }

      const { guesses, correctWord, rules, startTime, endTime } = game

      if (!correctWord || !rules || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing session data' })
      }

      const guessCount = guesses.length
      const timeTakenInSeconds = scoreService.calculateTimeTaken(startTime, endTime)

      const score = scoreService.createScore(
        api,
        name,
        guessCount,
        correctWord,
        startTime,
        endTime,
        timeTakenInSeconds,
        rules
      )

      await score.save()
      gameSessionService.destroySession(req)

      res.json({ success: true })
    } catch (err) {
      next(err)
    }
  }

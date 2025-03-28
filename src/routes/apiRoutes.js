import express from 'express'
import initGame from '../services/initGame.js'

const router = express.Router()

export default function apiRoutes(api) {
  router.post('/start-game', async (req, res, next) => {
    try {
      const { wordLength, noLetterDuplicate } = req.body

      const gameStatus = await initGame(api, Number(wordLength), Boolean(noLetterDuplicate))
      res.json(gameStatus)
    } catch (err) {
      next(err)
    }
  })

  return router
}

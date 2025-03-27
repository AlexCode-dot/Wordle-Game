import express from 'express'
import initGame from '../services/initGame.js'

const router = express.Router()

export default function apiRoutes(api) {
  router.get('/start-game', async (req, res, next) => {
    try {
      const { wordLength, noLetterDuplicate } = req.query
      const isNoLetterDuplicate = JSON.parse(noLetterDuplicate.toLowerCase())

      const gameStatus = await initGame(api, Number(wordLength), isNoLetterDuplicate)
      res.json(gameStatus)
    } catch (err) {
      next(err)
    }
  })

  return router
}

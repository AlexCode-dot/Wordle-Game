import * as gameSessionService from '../services/gameSessionService.js'
import * as scoreService from '../services/scoreService.js'

export const submitScore = (api) => async (req, res, next) => {
  try {
    const { name, guessCount } = req.body
    const { correctWord, rules, startTime } = req.session.game || {}

    if (!correctWord || !rules || !startTime) {
      return res.status(400).json({ error: 'Missing session data' })
    }

    const formattedTime = scoreService.formatTime(startTime)
    const score = scoreService.createScore(api, name, guessCount, correctWord, formattedTime, rules)

    await score.save()

    gameSessionService.destroySession(req)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

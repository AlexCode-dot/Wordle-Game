import * as gameSessionService from '../services/gameSessionService.js'
import * as scoreService from '../services/scoreService.js'

export const submitScore = (api) => async (req, res, next) => {
  try {
    const { name, guessCount } = req.body
    const { correctWord, rules, startTime, endTime } = req.session.game || {}

    if (!correctWord || !rules || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing session data' })
    }

    const formattedTime = scoreService.calculateTimeTaken(startTime, endTime)

    const score = scoreService.createScore(api, name, guessCount, correctWord, startTime, endTime, formattedTime, rules)

    await score.save()
    gameSessionService.destroySession(req)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

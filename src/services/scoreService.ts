import formatTime from '../lib/formatTime'
import { API, HighScoreDocument, GameRules, FormattedScore } from '../types'

export function calculateTimeTaken(startTime: number, endTime: number) {
  const timeTakenMs = endTime - startTime
  return Math.floor(timeTakenMs / 1000)
}

export function createScore(
  api: API,
  name: string,
  guessCount: number,
  correctWord: string,
  startTime: number,
  endTime: number,
  formattedTime: number,
  rules: GameRules
) {
  return new api.HighScore({
    name,
    guessCount,
    correctWord,
    startTime,
    endTime,
    timeTaken: formattedTime,
    rules,
  })
}

export async function getLeaderboard(api: API, filters = {}): Promise<FormattedScore[]> {
  try {
    const scoresData = await api.HighScore.find(filters).sort({ timeTaken: 1 }).exec()

    const formattedScores = scoresData.map((score: HighScoreDocument) => {
      const formattedTime = formatTime(score.timeTaken)
      return {
        name: score.name,
        guessCount: score.guessCount,
        timeTaken: formattedTime,
        wordLength: score.rules.wordLength,
        noLetterDuplicate: score.rules.noLetterDuplicate ? 'Yes' : 'No',
      }
    })

    return formattedScores
  } catch (err) {
    throw new Error('Error fetching leaderboard data')
  }
}

export async function getUniqueWordLengths(api: API): Promise<number[]> {
  try {
    return await api.HighScore.distinct('rules.wordLength')
  } catch (err) {
    throw new Error('Error fetching unique word lengths')
  }
}

import formatTime from '../lib/formatTime.js'

export function calculateTimeTaken(startTime, endTime) {
  const timeTakenMs = endTime - startTime
  const timeTakenInSeconds = Math.floor(timeTakenMs / 1000)
  return timeTakenInSeconds
}

export function createScore(api, name, guessCount, correctWord, startTime, endTime, formattedTime, rules) {
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

export async function getLeaderboard(api, filters = {}) {
  try {
    const scoresData = await api.HighScore.find(filters).sort({ timeTaken: 1 })

    const formattedScores = scoresData.map((score) => {
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

export async function getUniqueWordLengths(api) {
  try {
    const wordLengthsNumbers = await api.HighScore.distinct('rules.wordLength')
    //const wordLengths = wordLengthsNumbers.map(length => String(length));  // Convert to strings if needed
    return wordLengthsNumbers
  } catch (err) {
    throw new Error('Error fetching unique word lengths')
  }
}

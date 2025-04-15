'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.calculateTimeTaken = calculateTimeTaken
exports.createScore = createScore
exports.getLeaderboard = getLeaderboard
exports.getUniqueWordLengths = getUniqueWordLengths
const formatTime_1 = __importDefault(require('../lib/formatTime'))
function calculateTimeTaken(startTime, endTime) {
  const timeTakenMs = endTime - startTime
  return Math.floor(timeTakenMs / 1000)
}
function createScore(api, name, guessCount, correctWord, startTime, endTime, formattedTime, rules) {
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
async function getLeaderboard(api, filters = {}) {
  try {
    const scoresData = await api.HighScore.find(filters).sort({ timeTaken: 1 }).exec()
    const formattedScores = scoresData.map((score) => {
      const formattedTime = (0, formatTime_1.default)(score.timeTaken)
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
async function getUniqueWordLengths(api) {
  try {
    return await api.HighScore.distinct('rules.wordLength')
  } catch (err) {
    throw new Error('Error fetching unique word lengths')
  }
}

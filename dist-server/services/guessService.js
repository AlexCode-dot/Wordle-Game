'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.handleGuess = handleGuess
const wordFeedback_1 = __importDefault(require('./wordFeedback'))
const formatTime_1 = __importDefault(require('../lib/formatTime'))
const scoreService_1 = require('./scoreService')
function handleGuess(guessedWord, game) {
  const correctWord = game.correctWord
  const feedback = (0, wordFeedback_1.default)(guessedWord, correctWord)
  if (!feedback) {
    return { error: 'Your guess was not valid, try another word.' }
  }
  const gameWon = feedback.every((l) => l.result === 'correct')
  const result = {
    feedback,
    gameWon,
  }
  if (gameWon) {
    const endTime = Date.now()
    game.endTime = endTime
    const timeTakenInSeconds = (0, scoreService_1.calculateTimeTaken)(game.startTime, endTime)
    const formattedTime = (0, formatTime_1.default)(timeTakenInSeconds)
    result.timeTaken = formattedTime
    result.timeTakenInSeconds = timeTakenInSeconds
  }
  return result
}

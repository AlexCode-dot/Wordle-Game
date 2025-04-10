import wordFeedBack from './wordFeedback.js'
import formatTime from '../lib/formatTime.js'
import { calculateTimeTaken } from './scoreService.js'

export function handleGuess(guessedWord, game) {
  const correctWord = game.correctWord
  const feedback = wordFeedBack(guessedWord, correctWord)

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
    const timeTakenInSeconds = calculateTimeTaken(game.startTime, endTime)
    const formattedTime = formatTime(timeTakenInSeconds)
    result.timeTaken = formattedTime
    result.timeTakenInSeconds = timeTakenInSeconds
  }

  return result
}

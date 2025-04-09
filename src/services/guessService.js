import wordFeedBack from './wordFeedback.js'
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
    result.timeTaken = calculateTimeTaken(game.startTime, endTime)
  }

  return result
}

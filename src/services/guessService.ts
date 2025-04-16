import wordFeedBack from './wordFeedback'
import formatTime from '../lib/formatTime'
import { calculateTimeTaken } from './scoreService'
import { SessionGame, GuessResult } from '../types'

export function handleGuess(guessedWord: string, game: SessionGame): GuessResult | { error: string } {
  const correctWord = game.correctWord
  const feedback = wordFeedBack(guessedWord, correctWord)

  if (!feedback) {
    return { error: 'Your guess was not valid, try another word.' }
  }

  const gameWon = feedback.every((l) => l.result === 'correct')
  const result: GuessResult = {
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

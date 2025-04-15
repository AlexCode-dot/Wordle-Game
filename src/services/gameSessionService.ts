import { Request } from 'express'
import { GameRules, SessionGame, LetterFeedback } from '../types'

export function startNewGame(req: Request, gameStatus: { correctWord: string }, gameSettings: GameRules): void {
  req.session.game = {
    correctWord: gameStatus.correctWord,
    startTime: Date.now(),
    rules: gameSettings,
    guesses: [],
    state: 'playing',
  }
}

export function saveGuess(req: Request, feedback: LetterFeedback[], gameWon: boolean, timeTaken?: string): void {
  const game = req.session.game as SessionGame
  game.guesses.push(feedback)

  if (gameWon) {
    game.state = 'win'
    game.winningFeedback = feedback
    game.timeTaken = timeTaken
  }
}

export function retrieveSessionGameStatus(req: Request): SessionGame | null {
  return req.session.game ?? null
}

export function destroySession(req: Request): void {
  req.session.destroy((err: Error | null) => {
    if (err) {
      console.error('Error destroying session:', err)
      throw new Error('Failed to destroy session.')
    }
  })
}

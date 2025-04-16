import { Request } from 'express'
import { GameRules, SessionGame, LetterFeedback } from '../types'

export function startNewGame(req: Request, gameStatus: { correctWord: string }, gameSettings: GameRules) {
  req.session.game = {
    correctWord: gameStatus.correctWord,
    startTime: Date.now(),
    rules: gameSettings,
    guesses: [],
    state: 'playing',
  }
}

export function saveGuess(req: Request, feedback: LetterFeedback[], gameWon: boolean, timeTaken?: string) {
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

export function destroySession(req: Request, callback?: (err?: Error) => void) {
  req.session.destroy((err: Error | null) => {
    if (err) {
      console.error('Error destroying session:', err)
      if (callback) callback(err)
    } else {
      if (callback) callback()
    }
  })
}

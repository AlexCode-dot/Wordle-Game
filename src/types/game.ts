export interface GameRules {
  wordLength: number
  noLetterDuplicate: boolean
}

export interface GuessResult {
  feedback: LetterFeedback[]
  gameWon: boolean
  timeTaken?: string
  timeTakenInSeconds?: number
  error?: string
}

export interface LetterFeedback {
  letter: string
  result: string
}

export interface SessionGame {
  correctWord: string
  startTime: number
  endTime?: number
  rules: GameRules
  guesses: LetterFeedback[][]
  state: string
  winningFeedback?: LetterFeedback[]
  timeTaken?: string
}

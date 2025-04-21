export interface GameRules {
  wordLength: number
  noLetterDuplicate: boolean
  language: 'en' | 'sv'
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
  state: 'setup' | 'playing' | 'win' | 'lose'
  winningFeedback?: LetterFeedback[]
  timeTaken?: string
}

export interface InitGameResult {
  correctWord?: string
  gameStarted: boolean
  wordLength?: number
  message?: string
}

export interface GuessResponse {
  letterFeedback: LetterFeedback[]
  gameWon: boolean
  timeTaken?: string
}

export interface GameStatusResponse {
  gameStarted: boolean
  rules: GameRules
  guesses: LetterFeedback[][]
  state: 'setup' | 'playing' | 'win' | 'lose'
  winningFeedback: LetterFeedback[] | null
  timeTaken?: string
}

export interface RevealWordResponse {
  correctWord: string
}

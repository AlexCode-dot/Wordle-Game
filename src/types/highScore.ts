import { Document } from 'mongoose'
import { GameRules } from './game'

export interface HighScoreData {
  name: string
  guessCount: number
  correctWord: string
  timeTaken: number
  startTime: number
  endTime: number
  rules: GameRules
}

export interface HighScoreDocument extends HighScoreData, Document {
  createdAt?: Date
}

export interface ScoreFilterQuery {
  length?: string
  unique?: string
}

export interface ScoreFilterResult {
  filters: Record<string, any>
  activeFilters: ScoreFilterQuery
}

export interface FormattedScore {
  name: string
  guessCount: number
  timeTaken: string
  wordLength: number
  noLetterDuplicate: string
}

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

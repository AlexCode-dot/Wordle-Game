import { Model } from 'mongoose'
import { HighScoreDocument } from './highScore'

export interface API {
  loadWords: () => Promise<string[]>
  HighScore: Model<HighScoreDocument>
}

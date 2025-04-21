import { Model } from 'mongoose'
import { HighScoreDocument } from './highScore'
import { WordSource, WordLanguage } from '../types'

export interface API {
  loadWords: (source: WordSource, lang: WordLanguage) => Promise<string[]>
  HighScore: Model<HighScoreDocument>
}

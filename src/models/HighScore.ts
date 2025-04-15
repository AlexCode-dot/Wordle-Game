import mongoose from 'mongoose'
import { HighScoreDocument } from '../types'

const highScoreSchema = new mongoose.Schema<HighScoreDocument>({
  name: { type: String, required: true },
  guessCount: { type: Number, required: true },
  correctWord: { type: String, required: true },
  timeTaken: { type: Number, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  rules: {
    wordLength: { type: Number, required: true },
    noLetterDuplicate: { type: Boolean, required: true },
  },
  createdAt: { type: Date, default: Date.now },
})

const HighScore = mongoose.model<HighScoreDocument>('HighScore', highScoreSchema)

export default HighScore

// models/HighScore.js
import mongoose from 'mongoose'

const highScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  guessCount: { type: Number, required: true },
  correctWord: { type: String, required: true },
  timeTaken: { type: Number, required: true },
  rules: {
    wordLength: { type: Number, required: true },
    noLetterDuplicate: { type: Boolean, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('HighScore', highScoreSchema)

'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const mongoose_1 = __importDefault(require('mongoose'))
const highScoreSchema = new mongoose_1.default.Schema({
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
const HighScore = mongoose_1.default.model('HighScore', highScoreSchema)
exports.default = HighScore

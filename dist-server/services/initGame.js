'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.default = initGame
const wordSelector_1 = __importDefault(require('./wordSelector'))
async function processWord(wordList, gameSettings) {
  const { wordLength, noLetterDuplicate } = gameSettings
  const correctWord = (0, wordSelector_1.default)(wordList, wordLength, noLetterDuplicate)
  return correctWord
}
async function initGame(api, gameSettings) {
  const wordList = await api.loadWords()
  const correctWord = await processWord(wordList, gameSettings)
  if (correctWord === 'No matching word found.') {
    return { message: correctWord, gameStarted: false }
  } else {
    console.log(correctWord)
    return { wordLength: correctWord.length, gameStarted: true, correctWord }
  }
}

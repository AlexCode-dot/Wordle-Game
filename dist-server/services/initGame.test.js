'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const initGame_1 = __importDefault(require('./initGame'))
const globals_1 = require('@jest/globals')
;(0, globals_1.describe)('initGame', () => {
  const mockApi = {
    loadWords: async () => ['apple', 'banana', 'cherry', 'pear', 'melon'],
    HighScore: {},
  }
  ;(0, globals_1.it)('should start the game and return correct word data', async () => {
    const gameSettings = { wordLength: 5, noLetterDuplicate: true }
    const result = await (0, initGame_1.default)(mockApi, gameSettings)
    ;(0, globals_1.expect)(result.gameStarted).toBe(true)
    ;(0, globals_1.expect)(result.wordLength).toBe(5)
    ;(0, globals_1.expect)(result.correctWord).toBe('melon')
  })
  ;(0, globals_1.it)('should handle no matching word found', async () => {
    const mockApiEmpty = {
      loadWords: async () => [],
      HighScore: {},
    }
    const gameSettings = { wordLength: 10, noLetterDuplicate: true }
    const result = await (0, initGame_1.default)(mockApiEmpty, gameSettings)
    ;(0, globals_1.expect)(result.gameStarted).toBe(false)
    ;(0, globals_1.expect)(result.message).toBe('No matching word found.')
  })
})

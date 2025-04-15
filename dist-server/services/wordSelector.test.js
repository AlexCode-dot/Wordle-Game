'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const globals_1 = require('@jest/globals')
const wordSelector_1 = __importDefault(require('./wordSelector'))
;(0, globals_1.describe)('getWord()', () => {
  ;(0, globals_1.it)("should return 'Inget passande ord hittades' when input 'wordsList' is empty", () => {
    const output = (0, wordSelector_1.default)([], 3, false)
    ;(0, globals_1.expect)(output).toEqual('No matching word found.')
  })
  ;(0, globals_1.it)("should return 'Inget passande ord hittades' when there is no suitable word", () => {
    const output = (0, wordSelector_1.default)(['cykla'], 3, false)
    ;(0, globals_1.expect)(output).toEqual('No matching word found.')
  })
  ;(0, globals_1.it)("should only return one of the words with the same length as the input 'wordLength' ", () => {
    const originalMathRandom = Math.random
    Math.random = () => 0
    const output = (0, wordSelector_1.default)(['test', 'mage', 'bok'], 4, false)
    ;(0, globals_1.expect)(output).toBe('test')
    Math.random = () => 0.99
    const output2 = (0, wordSelector_1.default)(['test', 'mage', 'bok'], 4, false)
    ;(0, globals_1.expect)(output2).toBe('mage')
    Math.random = originalMathRandom
  })
  ;(0, globals_1.it)(
    "should only return words with no duplicated letters if 'noLetterDuplicate' is equal to true",
    () => {
      const originalMathRandom = Math.random
      Math.random = () => 0
      const output = (0, wordSelector_1.default)(['jagar', 'cykla'], 5, true)
      ;(0, globals_1.expect)(output).toBe('cykla')
      Math.random = originalMathRandom
    }
  )
  ;(0, globals_1.it)(
    "should return words with duplicated letters and no duplicated letters if 'noLetterDuplicate' is equal to false",
    () => {
      const originalMathRandom = Math.random
      Math.random = () => 0
      const output = (0, wordSelector_1.default)(['jagar', 'cykla'], 5, false)
      ;(0, globals_1.expect)(output).toBe('jagar')
      Math.random = () => 0.99
      const output2 = (0, wordSelector_1.default)(['jagar', 'cykla'], 5, false)
      ;(0, globals_1.expect)(output2).toBe('cykla')
      Math.random = originalMathRandom
    }
  )
  ;(0, globals_1.it)('should filter out special characters and spaces from the word before validation', () => {
    const output = (0, wordSelector_1.default)(['c ykl-a!'], 5, false)
    ;(0, globals_1.expect)(output).toEqual('cykla')
  })
})

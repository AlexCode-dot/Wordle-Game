'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const globals_1 = require('@jest/globals')
const wordFeedback_1 = __importDefault(require('./wordFeedback'))
;(0, globals_1.describe)('generateWordFeedback()', () => {
  ;(0, globals_1.it)('should return false if the two input strings are not the same length', () => {
    const output = (0, wordFeedback_1.default)('test', 'tests')
    ;(0, globals_1.expect)(output).toEqual(false)
  })
  ;(0, globals_1.it)("should return an array of objects where each object has 'letter' and 'result'", () => {
    const result = (0, wordFeedback_1.default)('test', 'test')
    ;(0, globals_1.expect)(Array.isArray(result)).toBe(true)
    if (result !== false) {
      result.forEach((item) => {
        ;(0, globals_1.expect)(typeof item).toBe('object')
        ;(0, globals_1.expect)(item).toHaveProperty('letter')
        ;(0, globals_1.expect)(item).toHaveProperty('result')
      })
    }
  })
  ;(0, globals_1.it)("should return 'correct' for all letters when both words are identical", () => {
    const output = (0, wordFeedback_1.default)('test', 'test')
    ;(0, globals_1.expect)(output).toEqual([
      { letter: 't', result: 'correct' },
      { letter: 'e', result: 'correct' },
      { letter: 's', result: 'correct' },
      { letter: 't', result: 'correct' },
    ])
  })
  ;(0, globals_1.it)(
    "should return 'incorrect' for all letters when there is no matching letters between the words",
    () => {
      const output = (0, wordFeedback_1.default)('magi', 'test')
      ;(0, globals_1.expect)(output).toEqual([
        { letter: 'm', result: 'incorrect' },
        { letter: 'a', result: 'incorrect' },
        { letter: 'g', result: 'incorrect' },
        { letter: 'i', result: 'incorrect' },
      ])
    }
  )
  ;(0, globals_1.it)(
    "should return 'incorrect' for all letters when there is no matching letters between the words",
    () => {
      const output = (0, wordFeedback_1.default)('stol', 'lost')
      ;(0, globals_1.expect)(output).toEqual([
        { letter: 's', result: 'misplaced' },
        { letter: 't', result: 'misplaced' },
        { letter: 'o', result: 'misplaced' },
        { letter: 'l', result: 'misplaced' },
      ])
    }
  )
  ;(0, globals_1.it)("should return the correct 'result' value for each letter in the word", () => {
    const output = (0, wordFeedback_1.default)('bok', 'kop')
    ;(0, globals_1.expect)(output).toEqual([
      { letter: 'b', result: 'incorrect' },
      { letter: 'o', result: 'correct' },
      { letter: 'k', result: 'misplaced' },
    ])
  })
  ;(0, globals_1.it)(
    "should prioritize matched indices when a letter occurs more times in the guess than in the correct word, and set duplicates to 'incorrect",
    () => {
      const output = (0, wordFeedback_1.default)('lagga', 'lagar')
      ;(0, globals_1.expect)(output).toEqual([
        { letter: 'l', result: 'correct' },
        { letter: 'a', result: 'correct' },
        { letter: 'g', result: 'correct' },
        { letter: 'g', result: 'incorrect' },
        { letter: 'a', result: 'misplaced' },
      ])
    }
  )
  ;(0, globals_1.it)(
    'should filter out special characters and spaces, and not include them in the word length check',
    () => {
      const output = (0, wordFeedback_1.default)('tes t', 'te- st!')
      ;(0, globals_1.expect)(output).toEqual([
        { letter: 't', result: 'correct' },
        { letter: 'e', result: 'correct' },
        { letter: 's', result: 'correct' },
        { letter: 't', result: 'correct' },
      ])
    }
  )
})

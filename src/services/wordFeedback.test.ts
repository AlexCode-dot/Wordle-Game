import generateWordFeedback from './wordFeedback'
import { describe, it, expect } from '@jest/globals'

describe('generateWordFeedback()', () => {
  it('should return false if the two input strings are not the same length', () => {
    const output = generateWordFeedback('test', 'tests', 'en')
    expect(output).toEqual(false)
  })

  it("should return an array of objects where each object has 'letter' and 'result'", () => {
    const result = generateWordFeedback('test', 'test', 'en')
    expect(Array.isArray(result)).toBe(true)
    if (result !== false) {
      result.forEach((item) => {
        expect(typeof item).toBe('object')
        expect(item).toHaveProperty('letter')
        expect(item).toHaveProperty('result')
      })
    }
  })

  it("should return 'correct' for all letters when both words are identical", () => {
    const output = generateWordFeedback('test', 'test', 'en')
    expect(output).toEqual([
      { letter: 't', result: 'correct' },
      { letter: 'e', result: 'correct' },
      { letter: 's', result: 'correct' },
      { letter: 't', result: 'correct' },
    ])
  })

  it("should return 'incorrect' for all letters when there is no matching letters between the words", () => {
    const output = generateWordFeedback('magi', 'test', 'en')
    expect(output).toEqual([
      { letter: 'm', result: 'incorrect' },
      { letter: 'a', result: 'incorrect' },
      { letter: 'g', result: 'incorrect' },
      { letter: 'i', result: 'incorrect' },
    ])
  })

  it("should return 'misplaced' for all letters when guessed word is an anagram", () => {
    const output = generateWordFeedback('stol', 'lost', 'en')
    expect(output).toEqual([
      { letter: 's', result: 'misplaced' },
      { letter: 't', result: 'misplaced' },
      { letter: 'o', result: 'misplaced' },
      { letter: 'l', result: 'misplaced' },
    ])
  })

  it("should return the correct 'result' value for each letter in the word", () => {
    const output = generateWordFeedback('bok', 'kop', 'en')
    expect(output).toEqual([
      { letter: 'b', result: 'incorrect' },
      { letter: 'o', result: 'correct' },
      { letter: 'k', result: 'misplaced' },
    ])
  })

  it('should prioritize matched indices when there are duplicate letters', () => {
    const output = generateWordFeedback('lagga', 'lagar', 'en')
    expect(output).toEqual([
      { letter: 'l', result: 'correct' },
      { letter: 'a', result: 'correct' },
      { letter: 'g', result: 'correct' },
      { letter: 'g', result: 'incorrect' },
      { letter: 'a', result: 'misplaced' },
    ])
  })

  it('should filter out special characters and spaces', () => {
    const output = generateWordFeedback('tes t', 'te- st!', 'en')
    expect(output).toEqual([
      { letter: 't', result: 'correct' },
      { letter: 'e', result: 'correct' },
      { letter: 's', result: 'correct' },
      { letter: 't', result: 'correct' },
    ])
  })
})

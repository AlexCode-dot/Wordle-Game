import getWord from './wordSelector'
import { describe, it, expect } from '@jest/globals'

describe('getWord()', () => {
  it("should return 'No matching word found.' when words list is empty", () => {
    const output = getWord([], 3, false)
    expect(output).toEqual('No matching word found.')
  })

  it("should return 'No matching word found.' when no suitable word exists", () => {
    const output = getWord(['cykla'], 3, false)
    expect(output).toEqual('No matching word found.')
  })

  it('should return a word of correct length', () => {
    const originalMathRandom = Math.random
    Math.random = () => 0

    const output = getWord(['test', 'mage', 'bok'], 4, false)
    expect(output).toBe('test')

    Math.random = () => 0.99
    const output2 = getWord(['test', 'mage', 'bok'], 4, false)
    expect(output2).toBe('mage')

    Math.random = originalMathRandom
  })

  it("should return only words with unique letters if 'noLetterDuplicate' is true", () => {
    const originalMathRandom = Math.random
    Math.random = () => 0

    const output = getWord(['jagar', 'cykla'], 5, true)
    expect(output).toBe('cykla')

    Math.random = originalMathRandom
  })

  it("should allow duplicated letters if 'noLetterDuplicate' is false", () => {
    const originalMathRandom = Math.random
    Math.random = () => 0

    const output = getWord(['jagar', 'cykla'], 5, false)
    expect(output).toBe('jagar')

    Math.random = () => 0.99
    const output2 = getWord(['jagar', 'cykla'], 5, false)
    expect(output2).toBe('cykla')

    Math.random = originalMathRandom
  })

  it('should clean special characters and spaces before validation', () => {
    const output = getWord(['c ykl-a!'], 5, false)
    expect(output).toEqual('cykla')
  })
})

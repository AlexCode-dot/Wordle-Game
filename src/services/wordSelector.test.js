import { expect, describe, it } from '@jest/globals'
import getWord from './wordSelector'

describe('getWord()', () => {
  it("should return 'Inget passande ord hittades' when input 'wordsList' is empty", () => {
    const output = getWord('', 3, false)
    expect(output).toEqual('Inget passande ord hittades.')
  })

  it("should return 'Inget passande ord hittades' when there is no suitable word", () => {
    const output = getWord(['cykla'], 3, false)
    expect(output).toEqual('Inget passande ord hittades.')
  })

  it("should only return one of the words with the same length as the input 'wordLength' ", () => {
    const originalMathRandom = Math.random
    Math.random = () => 0

    const output = getWord(['test', 'mage', 'bok'], 4, false)
    expect(output).toBe('test')

    Math.random = () => 0.99

    const output2 = getWord(['test', 'mage', 'bok'], 4, false)
    expect(output2).toBe('mage')

    Math.random = originalMathRandom
  })

  it("should only return words with no duplicated letters if 'noLetterDuplicate' is equal to true", () => {
    const originalMathRandom = Math.random
    Math.random = () => 0

    const output = getWord(['jagar', 'cykla'], 5, true)
    expect(output).toBe('cykla')

    Math.random = originalMathRandom
  })

  it("should return words with duplicated letters and no duplicated letters if 'noLetterDuplicate' is equal to false", () => {
    const originalMathRandom = Math.random
    Math.random = () => 0

    const output = getWord(['jagar', 'cykla'], 5, false)
    expect(output).toBe('jagar')

    Math.random = () => 0.99

    const output2 = getWord(['jagar', 'cykla'], 5, false)
    expect(output2).toBe('cykla')

    Math.random = originalMathRandom
  })

  it('should filter out special characters and spaces from the word before validation', () => {
    const output = getWord(['c ykl-a!'], 5, false)
    expect(output).toEqual('cykla')
  })
})

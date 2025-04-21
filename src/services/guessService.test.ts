import { handleGuess } from './guessService'
import { describe, it, expect } from '@jest/globals'
import { SessionGame } from '../types'

describe('handleGuess() without mocks', () => {
  it('returns error for invalid guess', () => {
    const game: SessionGame = {
      correctWord: 'apple',
      startTime: 1000,
      rules: { wordLength: 5, noLetterDuplicate: true, language: 'en' },
      guesses: [],
      state: 'playing',
    }

    const result = handleGuess('&&&&&', game)
    expect(result).toHaveProperty('error')
  })

  it('returns win result when guess is correct', () => {
    const game: SessionGame = {
      correctWord: 'apple',
      startTime: 1000,
      rules: { wordLength: 5, noLetterDuplicate: false, language: 'en' },
      guesses: [],
      state: 'playing',
    }

    const result = handleGuess('apple', game)

    if ('error' in result) throw new Error('Expected success, got error')

    expect(result.gameWon).toBe(true)
    expect(result.feedback.every((l) => l.result === 'correct')).toBe(true)
    expect(result.timeTaken).toBeDefined()
    expect(result.timeTakenInSeconds).toBeGreaterThanOrEqual(0)
    expect(game.endTime).toBeDefined()
  })

  it('returns non-win result for incorrect guess', () => {
    const game: SessionGame = {
      correctWord: 'apple',
      startTime: 1000,
      rules: { wordLength: 5, noLetterDuplicate: true, language: 'en' },
      guesses: [],
      state: 'playing',
    }

    const result = handleGuess('grape', game)

    if ('error' in result) throw new Error('Expected valid result, got error')

    expect(result.gameWon).toBe(false)
    expect(result.feedback).toHaveLength(5)
    expect(result.timeTaken).toBeUndefined()
    expect(result.timeTakenInSeconds).toBeUndefined()
    expect(game.endTime).toBeUndefined()
  })
})

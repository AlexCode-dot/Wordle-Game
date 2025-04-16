import initGame from './initGame'
import { describe, it, expect } from '@jest/globals'
import type { Model } from 'mongoose'
import type { HighScoreDocument, API } from '../types'

const dummyHighScore = {} as unknown as Model<HighScoreDocument>

const mockApi: API = {
  loadWords: async () => ['apple', 'banana', 'cherry', 'pear', 'melon'],
  HighScore: dummyHighScore,
}

const mockApiEmpty: API = {
  loadWords: async () => [],
  HighScore: dummyHighScore,
}

describe('initGame', () => {
  it('should start the game and return correct word data', async () => {
    const gameSettings = { wordLength: 5, noLetterDuplicate: true }
    const result = await initGame(mockApi, gameSettings)

    expect(result.gameStarted).toBe(true)
    expect(result.wordLength).toBe(5)
    expect(result.correctWord).toBe('melon')
  })

  it('should handle no matching word found', async () => {
    const gameSettings = { wordLength: 10, noLetterDuplicate: true }
    const result = await initGame(mockApiEmpty, gameSettings)

    expect(result.gameStarted).toBe(false)
    expect(result.message).toBe('No matching word found.')
  })
})

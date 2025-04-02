import initGame from '../services/initGame.js'
import { expect, describe, it } from '@jest/globals'

describe('initGame', () => {
  const mockApi = {
    loadWords: async () => ['apple', 'banana', 'cherry', 'pear', 'melon'],
  }

  it('should start the game and return correct word data', async () => {
    const gameSettings = { wordLength: 5, noLetterDuplicate: true }
    const result = await initGame(mockApi, gameSettings)

    expect(result.gameStarted).toBe(true)
    expect(result.wordLength).toBe(5)
    expect(result.correctWord).toBe('melon')
  })

  it('should handle no matching word found', async () => {
    const mockApiEmpty = {
      loadWords: async () => [],
    }

    const gameSettings = { wordLength: 10, noLetterDuplicate: true }
    const result = await initGame(mockApiEmpty, gameSettings)

    expect(result.gameStarted).toBe(false)
    expect(result.message).toBe('No matching word found.')
  })
})

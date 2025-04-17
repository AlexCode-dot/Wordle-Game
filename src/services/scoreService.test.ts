import { describe, it, expect } from '@jest/globals'
import { calculateTimeTaken, createScore, getLeaderboard, getUniqueWordLengths } from './scoreService'
import { API } from '../types'

describe('calculateTimeTaken()', () => {
  it('returns the time in seconds between two timestamps', () => {
    const result = calculateTimeTaken(1000, 6000)
    expect(result).toBe(5)
  })
})

describe('createScore()', () => {
  it('returns a score object with all fields set', () => {
    function HighScoreMock(data: any) {
      return data
    }

    const mockApi = {
      HighScore: HighScoreMock,
      loadWords: async () => [],
    } as unknown as API

    const result = createScore(mockApi, 'Alex', 3, 'melon', 1000, 2000, 1, { wordLength: 5, noLetterDuplicate: true })

    expect(result.name).toBe('Alex')
    expect(result.guessCount).toBe(3)
    expect(result.correctWord).toBe('melon')
    expect(result.startTime).toBe(1000)
    expect(result.endTime).toBe(2000)
    expect(result.timeTaken).toBe(1)
    expect(result.rules.wordLength).toBe(5)
    expect(result.rules.noLetterDuplicate).toBe(true)
  })
})

describe('getLeaderboard()', () => {
  it('returns formatted score data', async () => {
    const mockApi = {
      HighScore: {
        find: function () {
          return {
            sort: function () {
              return {
                exec: async function () {
                  return [
                    {
                      name: 'Alex',
                      guessCount: 4,
                      timeTaken: 42,
                      rules: { wordLength: 5, noLetterDuplicate: false },
                    },
                  ]
                },
              }
            },
          }
        },
      },
      loadWords: async () => [],
    } as unknown as API

    const result = await getLeaderboard(mockApi)

    expect(Array.isArray(result)).toBe(true)
    expect(result[0].name).toBe('Alex')
    expect(result[0].guessCount).toBe(4)
    expect(result[0].wordLength).toBe(5)
    expect(result[0].noLetterDuplicate).toBe('No')
  })

  it('throws an error when db call fails', async () => {
    const mockApi = {
      HighScore: {
        find: function () {
          return {
            sort: function () {
              return {
                exec: async function () {
                  throw new Error('fail')
                },
              }
            },
          }
        },
      },
      loadWords: async () => [],
    } as unknown as API

    await expect(getLeaderboard(mockApi)).rejects.toThrow('Error fetching leaderboard data')
  })
})

describe('getUniqueWordLengths()', () => {
  it('returns distinct word lengths', async () => {
    const mockApi = {
      HighScore: {
        distinct: async function () {
          return [4, 5, 6]
        },
      },
      loadWords: async () => [],
    } as unknown as API

    const result = await getUniqueWordLengths(mockApi)
    expect(result).toEqual([4, 5, 6])
  })

  it('throws an error if the db call fails', async () => {
    const mockApi = {
      HighScore: {
        distinct: async function () {
          throw new Error('fail')
        },
      },
      loadWords: async () => [],
    } as unknown as API

    await expect(getUniqueWordLengths(mockApi)).rejects.toThrow('Error fetching unique word lengths')
  })
})

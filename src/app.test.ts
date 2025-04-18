import request from 'supertest'
import initApp from './app'
import { describe, it, expect } from '@jest/globals'
import type { API } from './types'
import { getLeaderboard } from './services/scoreService'

function DummyHighScore(this: any) {}
DummyHighScore.find = () => ({
  sort: () => ({
    exec: () =>
      Promise.resolve([
        {
          name: 'Alex',
          guessCount: 1,
          timeTaken: 5,
          rules: { wordLength: 5, noLetterDuplicate: false },
          createdAt: new Date(),
        },
      ]),
  }),
})
DummyHighScore.distinct = async () => [3, 4, 5]

const baseApi: API = {
  loadWords: async () => [],
  HighScore: DummyHighScore as unknown as API['HighScore'],
}

describe('SSR pages', () => {
  it('renders homepage', async () => {
    const app = await initApp(baseApi)
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.text).toContain('<div id="root"></div>')
  })

  it('renders about page', async () => {
    const app = await initApp(baseApi)
    const res = await request(app).get('/about')
    expect(res.status).toBe(200)
    expect(res.text).toContain('About the Project')
  })

  it('renders leaderboard with mocked data', async () => {
    const app = await initApp(baseApi)
    const res = await request(app).get('/leaderboard')
    expect(res.status).toBe(200)
    expect(res.text).toContain('Alex')
    expect(res.text).toContain('1')
    expect(res.text).toContain('00:05')
  })
})

// Leaderboard filtering tests
function FilteredHighScore(this: any) {}
FilteredHighScore.find = (filter: any = {}) => {
  const mockEntry = {
    name: 'Alex',
    guessCount: 2,
    timeTaken: 10,
    rules: { wordLength: 5, noLetterDuplicate: false },
    createdAt: new Date(),
  }

  const shouldMatch = filter['rules.wordLength'] === 5 && filter['rules.noLetterDuplicate'] === false

  return {
    sort: () => ({
      exec: async () => (shouldMatch ? [mockEntry] : []),
    }),
  }
}
FilteredHighScore.distinct = async () => [3, 4, 5, 6]

const filteredApi: API = {
  loadWords: async () => [],
  HighScore: FilteredHighScore as unknown as API['HighScore'],
}

describe('SSR leaderboard filtering', () => {
  it('shows filtered results when query matches', async () => {
    const app = await initApp(filteredApi)
    const res = await request(app).get('/leaderboard?length=5&unique=false')
    expect(res.status).toBe(200)
    expect(res.text).toContain('Alex')
    expect(res.text).toContain('2')
    expect(res.text).toContain('00:10')
  })

  it('hides results when query does not match', async () => {
    const app = await initApp(filteredApi)
    const res = await request(app).get('/leaderboard?length=4&unique=true')
    expect(res.status).toBe(200)
    expect(res.text).not.toContain('Alex')
  })
})

describe('getLeaderboard()', () => {
  it('returns scores sorted by timeTaken ascending', async () => {
    const sortedMockScores = [
      {
        name: 'A',
        guessCount: 3,
        timeTaken: 5,
        rules: { wordLength: 5, noLetterDuplicate: true },
        createdAt: new Date(),
      },
      {
        name: 'B',
        guessCount: 4,
        timeTaken: 10,
        rules: { wordLength: 5, noLetterDuplicate: true },
        createdAt: new Date(),
      },
      {
        name: 'C',
        guessCount: 5,
        timeTaken: 15,
        rules: { wordLength: 5, noLetterDuplicate: true },
        createdAt: new Date(),
      },
    ]

    const mockApi: API = {
      loadWords: async () => [],
      HighScore: {
        find: () => ({
          sort: () => ({
            exec: async () => sortedMockScores,
          }),
        }),
      } as any,
    }

    const result = await getLeaderboard(mockApi)

    expect(result.map((r) => r.name)).toEqual(['A', 'B', 'C'])
    expect(result.map((r) => r.timeTaken)).toEqual(['00:05', '00:10', '00:15'])
  })
})

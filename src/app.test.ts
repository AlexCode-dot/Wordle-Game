import request from 'supertest'
import initApp from '../src/app'
import { expect, it } from '@jest/globals'
import type { API } from './types'

function DummyHighScore(this: any) {
  this.save = () => Promise.resolve()
}
DummyHighScore.find = () => ({
  sort: () => ({
    exec: () => Promise.resolve([]),
  }),
})
DummyHighScore.distinct = async () => [3, 5, 6]

const mockApi: API = {
  loadWords: async () => [],
  HighScore: DummyHighScore as unknown as API['HighScore'],
}

it('SSR: renders homepage', async () => {
  const app = await initApp(mockApi)
  const response = await request(app).get('/')
  expect(response.status).toBe(200)
  expect(response.text).toContain('<div id="root"></div>')
})

it('SSR: renders about page', async () => {
  const app = await initApp(mockApi)
  const response = await request(app).get('/about')
  expect(response.status).toBe(200)
  expect(response.text).toContain('<h1 class="about-page__title">About the Project</h1>')
})

it('SSR: renders leaderboard page', async () => {
  const app = await initApp(mockApi)
  const response = await request(app).get('/leaderboard')
  expect(response.status).toBe(200)
  expect(response.text).toContain('<h1 class="leaderboard__title">Leaderboard</h1>')
})

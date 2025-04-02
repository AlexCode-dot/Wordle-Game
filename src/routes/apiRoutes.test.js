import express from 'express'
import request from 'supertest'
import apiRoutes from './apiRoutes'
import { expect, describe, it } from '@jest/globals'

describe('POST /start-game', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use(apiRoutes({ loadWords: async () => ['melon', 'banana', 'cherry'] }))
  })

  it('should start the game and return correct word data', async () => {
    const gameSettings = { wordLength: 5, noLetterDuplicate: true }

    const response = await request(app)
      .post('/start-game')
      .send(gameSettings)
      .expect('Content-Type', /json/)
      .expect(201)

    expect(response.body.gameStarted).toBe(true)
    expect(response.body.wordLength).toBe(5)
  })

  it('should handle no matching word found', async () => {
    const emptyApi = { loadWords: async () => [] }
    app.use(apiRoutes(emptyApi))

    const gameSettings = { wordLength: 10, noLetterDuplicate: true }

    const response = await request(app)
      .post('/start-game')
      .send(gameSettings)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body.gameStarted).toBe(false)
    expect(response.body.message).toBe('No matching word found.')
  })
})

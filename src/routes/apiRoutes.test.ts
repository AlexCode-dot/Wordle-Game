import express from 'express'
import session from 'express-session'
import request from 'supertest'
import apiRoutes from './apiRoutes'
import { describe, it, expect } from '@jest/globals'
import type { Model } from 'mongoose'
import type { API, HighScoreDocument } from '../types' // Adjust path if needed

const dummyHighScore = {} as unknown as Model<HighScoreDocument>

function createApp(api: API) {
  const app = express()
  app.use(express.json())
  app.use(
    session({
      secret: 'testsecret',
      resave: false,
      saveUninitialized: true,
    })
  )
  app.use(apiRoutes(api))
  return app
}

describe('POST /start-game', () => {
  it('should start the game and return correct word data', async () => {
    const app = createApp({
      loadWords: async () => ['melon', 'banana', 'cherry'],
      HighScore: dummyHighScore,
    })

    const gameSettings = { wordLength: 5, noLetterDuplicate: true }

    const response = await request(app).post('/games').send(gameSettings).expect('Content-Type', /json/).expect(201)

    expect(response.body.gameStarted).toBe(true)
    expect(response.body.wordLength).toBe(5)
  })

  it('should handle no matching word found', async () => {
    const app = createApp({
      loadWords: async () => [],
      HighScore: dummyHighScore,
    })

    const gameSettings = { wordLength: 10, noLetterDuplicate: true }

    const response = await request(app).post('/games').send(gameSettings).expect('Content-Type', /json/).expect(400)

    expect(response.body.gameStarted).toBe(false)
    expect(response.body.message).toBe('No matching word found.')
  })
})

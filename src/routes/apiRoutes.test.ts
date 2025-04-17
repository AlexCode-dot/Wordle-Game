import express from 'express'
import session from 'express-session'
import request from 'supertest'
import apiRoutes from './apiRoutes'
import { describe, it, expect, beforeEach } from '@jest/globals'
import type { API } from '../types'

let testWords: string[] = []

beforeEach(() => {
  testWords = []
})

function createTestApp(highScoreModel?: any) {
  function FallbackHighScore(this: any) {}
  FallbackHighScore.prototype.save = function () {
    return Promise.resolve()
  }

  const mockApi: API = {
    loadWords: async () => testWords,
    HighScore: highScoreModel ?? FallbackHighScore,
  }

  const app = express()
  app.use(express.json())
  app.use(
    session({
      secret: 'testsecret',
      resave: false,
      saveUninitialized: true,
    })
  )
  app.use(apiRoutes(mockApi))
  return app
}

// startGame Controller
describe('POST /games (startGame)', () => {
  it('starts a game and returns gameStarted: true', async () => {
    testWords = ['melon', 'banana', 'cherry']
    const app = createTestApp()
    const response = await request(app).post('/games').send({ wordLength: 5, noLetterDuplicate: true }).expect(201)

    expect(response.body.gameStarted).toBe(true)
    expect(response.body.wordLength).toBe(5)
  })

  it('returns 400 if no matching word is found', async () => {
    testWords = []
    const app = createTestApp()
    const response = await request(app).post('/games').send({ wordLength: 10, noLetterDuplicate: true }).expect(400)

    expect(response.body.gameStarted).toBe(false)
    expect(response.body.message).toBe('No matching word found.')
  })
})

// getGameStatus Controller
describe('GET /games/status', () => {
  it('returns gameStarted: false if no game session exists', async () => {
    testWords = ['apple']
    const app = createTestApp()
    const response = await request(app).get('/games/status').expect(200)
    expect(response.body).toEqual({ gameStarted: false })
  })

  it('returns game status with session data if game exists', async () => {
    testWords = ['grape']
    const app = createTestApp()
    const agent = request.agent(app)

    await agent.post('/games').send({ wordLength: 5, noLetterDuplicate: true })
    const response = await agent.get('/games/status').expect(200)

    expect(response.body.gameStarted).toBe(true)
    expect(response.body.rules.wordLength).toBe(5)
    expect(Array.isArray(response.body.guesses)).toBe(true)
    expect(response.body.state).toBe('playing')
    expect(response.body.winningFeedback).toBe(null)
  })
})

// makeGuess Controller
describe('POST /games/guesses', () => {
  it('returns 400 if no game session is active', async () => {
    testWords = ['apple']
    const app = createTestApp()
    const response = await request(app).post('/games/guesses').send({ guessedWord: 'apple' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('No active game session.')
  })

  it('returns feedback and gameWon = true if guess is correct', async () => {
    testWords = ['apple']
    const app = createTestApp()
    const agent = request.agent(app)

    await agent.post('/games').send({ wordLength: 5, noLetterDuplicate: false })
    const response = await agent.post('/games/guesses').send({ guessedWord: 'apple' }).expect(200)

    expect(response.body.gameWon).toBe(true)
    expect(Array.isArray(response.body.letterFeedback)).toBe(true)
    expect(response.body.timeTaken).toMatch(/^\d{2}:\d{2}$/)
  })

  it('returns feedback and gameWon = false if guess is wrong', async () => {
    testWords = ['apple']
    const app = createTestApp()
    const agent = request.agent(app)

    await agent.post('/games').send({ wordLength: 5, noLetterDuplicate: false })
    const response = await agent.post('/games/guesses').send({ guessedWord: 'grape' }).expect(200)

    expect(response.body.gameWon).toBe(false)
    expect(Array.isArray(response.body.letterFeedback)).toBe(true)
    expect(response.body.timeTaken).toBeUndefined()
  })
})

// revealCorrectWord Controller
describe('GET /games/correct-word', () => {
  it('returns 400 if no active game session', async () => {
    testWords = ['apple']
    const app = createTestApp()
    const response = await request(app).get('/games/correct-word').expect(400)
    expect(response.body.error).toBe('No active game session.')
  })

  it('returns the correct word and clears session after', async () => {
    testWords = ['grape']
    const app = createTestApp()
    const agent = request.agent(app)

    await agent.post('/games').send({ wordLength: 5, noLetterDuplicate: true })
    const response = await agent.get('/games/correct-word').expect(200)

    expect(response.body.correctWord).toBe('grape')
    const status = await agent.get('/games/status').expect(200)
    expect(status.body.gameStarted).toBe(false)
  })
})

// deleteGameSession Controller
describe('DELETE /games', () => {
  it('returns 200 with message when a session exists', async () => {
    testWords = ['pear']
    const app = createTestApp()
    const agent = request.agent(app)

    await agent.post('/games').send({ wordLength: 4, noLetterDuplicate: true })
    const response = await agent.delete('/games').expect(200)
    expect(response.body.message).toBe('Game session removed.')
  })

  it('returns 200 with message when no session exists', async () => {
    testWords = ['pear']
    const app = createTestApp()
    const response = await request(app).delete('/games').expect(200)
    expect(response.body.message).toBe('No game session found.')
  })
})

// getWordLengths Controller
describe('GET /words/lengths', () => {
  it('returns an array of unique sorted word lengths', async () => {
    testWords = ['a', 'bb', 'ccc', 'dd', 'ccc']
    const app = createTestApp()
    const response = await request(app).get('/words/lengths').expect(200)
    expect(response.body).toEqual([1, 2, 3])
  })

  it('handles empty word list gracefully', async () => {
    testWords = []
    const app = createTestApp()
    const response = await request(app).get('/words/lengths').expect(200)
    expect(response.body).toEqual([])
  })
})

// submitScore Controller
describe('POST /submit-score', () => {
  it('returns 400 if no game session', async () => {
    const app = createTestApp()
    const response = await request(app).post('/submit-score').send({ name: 'Alice' }).expect(400)
    expect(response.body.error).toBe('No game session found.')
  })

  it('returns 400 if missing session data', async () => {
    const app = createTestApp()
    const agent = request.agent(app)
    testWords = ['apple']
    await agent.post('/games').send({ wordLength: 5, noLetterDuplicate: false })
    const response = await agent.post('/submit-score').send({ name: 'Alex' }).expect(400)
    expect(response.body.error).toBe('Missing session data')
  })

  it('returns success true when session complete', async () => {
    function HighScoreMock(this: any, data: any) {
      this.data = data
    }
    HighScoreMock.prototype.save = function () {
      return Promise.resolve(this)
    }
    const app = createTestApp(HighScoreMock)
    const agent = request.agent(app)
    testWords = ['apple']
    await agent.post('/games').send({ wordLength: 5, noLetterDuplicate: false })
    await agent.post('/games/guesses').send({ guessedWord: 'apple' })
    const response = await agent.post('/submit-score').send({ name: 'Alex' }).expect(200)
    expect(response.body.success).toBe(true)

    const status = await agent.get('/games/status').expect(200)
    expect(status.body.gameStarted).toBe(false)
  })
})

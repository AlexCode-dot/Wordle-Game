import { startNewGame, saveGuess, retrieveSessionGameStatus, destroySession } from './gameSessionService'

import { describe, it, expect } from '@jest/globals'
import { Request } from 'express'

describe('gameSessionService', () => {
  it('startNewGame sets a new session with game data', () => {
    const req = { session: {} } as unknown as Request

    const settings = { wordLength: 5, noLetterDuplicate: true }
    const status = { correctWord: 'apple' }

    startNewGame(req, status, settings)

    expect(req.session.game).toBeDefined()
    expect(req.session.game?.correctWord).toBe('apple')
    expect(req.session.game?.rules).toEqual(settings)
    expect(req.session.game?.state).toBe('playing')
    expect(req.session.game?.guesses).toEqual([])
    expect(typeof req.session.game?.startTime).toBe('number')
  })

  it('saveGuess adds a guess and handles win state', () => {
    const req = {
      session: {
        game: {
          guesses: [],
          state: 'playing',
        },
      },
    } as unknown as Request

    const feedback = [
      { letter: 'a', result: 'correct' },
      { letter: 'p', result: 'correct' },
      { letter: 'p', result: 'correct' },
      { letter: 'l', result: 'correct' },
      { letter: 'e', result: 'correct' },
    ]

    saveGuess(req, feedback, true, '00:05')

    expect(req.session.game?.guesses.length).toBe(1)
    expect(req.session.game?.state).toBe('win')
    expect(req.session.game?.winningFeedback).toEqual(feedback)
    expect(req.session.game?.timeTaken).toBe('00:05')
  })

  it('retrieveSessionGameStatus returns null when no session', () => {
    const req = { session: {} } as unknown as Request
    const result = retrieveSessionGameStatus(req)
    expect(result).toBeNull()
  })

  it('retrieveSessionGameStatus returns session game when present', () => {
    const req = { session: { game: { correctWord: 'test' } } } as unknown as Request
    const result = retrieveSessionGameStatus(req)
    expect(result?.correctWord).toBe('test')
  })

  it('destroySession calls session.destroy and handles callback', (done) => {
    let callbackCalled = false

    const req = {
      session: {
        destroy: function (cb: (err: Error | null) => void) {
          cb(null)
        },
      },
    } as unknown as Request

    destroySession(req, () => {
      callbackCalled = true
      expect(callbackCalled).toBe(true)
      done()
    })
  })

  it('destroySession calls callback with error on failure', (done) => {
    const error = new Error('fail')

    const req = {
      session: {
        destroy: function (cb: (err: Error | null) => void) {
          cb(error)
        },
      },
    } as unknown as Request

    destroySession(req, (err) => {
      expect(err).toBe(error)
      done()
    })
  })
})

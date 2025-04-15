'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const express_session_1 = __importDefault(require('express-session'))
const supertest_1 = __importDefault(require('supertest'))
const apiRoutes_1 = __importDefault(require('./apiRoutes'))
const globals_1 = require('@jest/globals')
const dummyHighScore = {}
// ✅ Helper function to create an app instance with the given API
function createApp(api) {
  const app = (0, express_1.default)()
  app.use(express_1.default.json())
  app.use(
    (0, express_session_1.default)({
      secret: 'testsecret',
      resave: false,
      saveUninitialized: true,
    })
  )
  app.use((0, apiRoutes_1.default)(api))
  return app
}
;(0, globals_1.describe)('POST /start-game', () => {
  ;(0, globals_1.it)('should start the game and return correct word data', async () => {
    const app = createApp({
      loadWords: async () => ['melon', 'banana', 'cherry'],
      HighScore: dummyHighScore,
    })
    const gameSettings = { wordLength: 5, noLetterDuplicate: true }
    const response = await (0, supertest_1.default)(app)
      .post('/games')
      .send(gameSettings)
      .expect('Content-Type', /json/)
      .expect(201)
    ;(0, globals_1.expect)(response.body.gameStarted).toBe(true)
    ;(0, globals_1.expect)(response.body.wordLength).toBe(5)
  })
  ;(0, globals_1.it)('should handle no matching word found', async () => {
    const app = createApp({
      loadWords: async () => [],
      HighScore: dummyHighScore,
    })
    const gameSettings = { wordLength: 10, noLetterDuplicate: true }
    const response = await (0, supertest_1.default)(app)
      .post('/games')
      .send(gameSettings)
      .expect('Content-Type', /json/)
      .expect(400)
    ;(0, globals_1.expect)(response.body.gameStarted).toBe(false)
    ;(0, globals_1.expect)(response.body.message).toBe('No matching word found.')
  })
})

'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = []
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k
          return ar
        }
      return ownKeys(o)
    }
    return function (mod) {
      if (mod && mod.__esModule) return mod
      var result = {}
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== 'default') __createBinding(result, mod, k[i])
      __setModuleDefault(result, mod)
      return result
    }
  })()
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.default = initApp
const express_1 = __importDefault(require('express'))
const express_handlebars_1 = require('express-handlebars')
const promises_1 = __importDefault(require('fs/promises'))
const renderPage_1 = __importDefault(require('./lib/renderPage'))
const errorHandler_1 = require('./lib/errorHandler')
const apiRoutes_1 = __importDefault(require('./routes/apiRoutes'))
const sessionConfig_1 = __importDefault(require('./lib/sessionConfig'))
const scoreService = __importStar(require('./services/scoreService'))
const leaderboardFilters_1 = require('./services/leaderboardFilters')
// Define the function to initialize the Express app
async function initApp(api) {
  const app = (0, express_1.default)()
  // Setup Handlebars engine for templating
  app.engine(
    'handlebars',
    (0, express_handlebars_1.engine)({
      helpers: {
        eq: (a, b) => {
          return String(a) === String(b) // Helper to compare two strings
        },
      },
    })
  )
  app.set('view engine', 'handlebars')
  app.set('views', './templates') // Directory where templates are located
  // Read the Vite manifest for bundling the JS
  const manifestData = await promises_1.default.readFile('static/dist/.vite/manifest.json', 'utf-8')
  const manifest = JSON.parse(manifestData)
  const jsFile = manifest['src/react/main.jsx'] ? manifest['src/react/main.jsx'].file : null
  // Define routes
  app.get('/', async (req, res, next) => {
    try {
      ;(0, renderPage_1.default)(res, 'play', { jsFile }) // Render the play page with the JS file
    } catch (err) {
      next(err) // Pass errors to the error handler
    }
  })
  app.get('/about', async (req, res, next) => {
    try {
      ;(0, renderPage_1.default)(res, 'about') // Render the about page
    } catch (err) {
      next(err) // Pass errors to the error handler
    }
  })
  // Leaderboard route with filtering
  app.get('/leaderboard', async (req, res, next) => {
    try {
      const { filters, activeFilters } = (0, leaderboardFilters_1.buildScoreFilters)(req.query) // Build filters for the leaderboard
      const formattedScores = await scoreService.getLeaderboard(api, filters) // Get leaderboard scores
      const uniqueWordLengths = await scoreService.getUniqueWordLengths(api) // Get unique word lengths
      // Render the leaderboard page
      ;(0, renderPage_1.default)(res, 'leaderboard', {
        allScores: formattedScores,
        activeFilters,
        wordLengths: uniqueWordLengths,
      })
    } catch (err) {
      next(err) // Pass errors to the error handler
    }
  })
  // Middleware setup
  app.use((0, sessionConfig_1.default)()) // Session management
  app.use(express_1.default.json()) // Parse incoming JSON requests
  // API routes
  app.use('/api', (0, apiRoutes_1.default)(api))
  // Static files
  app.use('/static', express_1.default.static('static'))
  const errorHandler = (err, req, res, next) => {
    console.error('A server error occurred:', err)
    const status = err.status || 500 // Safely fallback to 500 if status is not defined
    const errorMessage = err.message || 'An unexpected error occurred. Please try again later.'
    // If it's an API request, send the error as JSON
    if (req.originalUrl.startsWith('/api/')) {
      res.status(status).json({
        error: errorMessage,
        status,
      })
      return // Exit the middleware after sending the response
    }
    // For non-API requests, render an error page
    ;(0, errorHandler_1.renderErrorPage)(res, status, 'Technical error', errorMessage)
  }
  app.use(errorHandler) // Now use it as a middleware
  return app // Return the initialized app
}

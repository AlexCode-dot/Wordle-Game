import express, { Request, Response, NextFunction } from 'express'
import { ErrorRequestHandler } from 'express'
import { engine } from 'express-handlebars'
import fs from 'fs/promises'
import renderPage from './lib/renderPage'
import { renderErrorPage } from './lib/errorHandler'
import apiRoutes from './routes/apiRoutes'
import sessionConfig from './lib/sessionConfig'
import * as scoreService from './services/scoreService'
import { buildScoreFilters } from './services/leaderboardFilters'
import { API } from './types'

// Define the function to initialize the Express app
export default async function initApp(api: API) {
  const app = express()

  // Setup Handlebars engine for templating
  app.engine(
    'handlebars',
    engine({
      helpers: {
        eq: (a: string, b: string): boolean => {
          return String(a) === String(b) // Helper to compare two strings
        },
      },
    })
  )
  app.set('view engine', 'handlebars')
  app.set('views', './templates') // Directory where templates are located

  // Read the Vite manifest for bundling the JS
  const manifestData = await fs.readFile('static/dist/.vite/manifest.json', 'utf-8')
  const manifest = JSON.parse(manifestData)
  const jsFile = manifest['src/react/main.jsx'] ? manifest['src/react/main.jsx'].file : null

  // Define routes
  app.get('/', async (req, res, next) => {
    try {
      renderPage(res, 'play', { jsFile }) // Render the play page with the JS file
    } catch (err) {
      next(err) // Pass errors to the error handler
    }
  })

  app.get('/about', async (req, res, next) => {
    try {
      renderPage(res, 'about') // Render the about page
    } catch (err) {
      next(err) // Pass errors to the error handler
    }
  })

  // Leaderboard route with filtering
  app.get('/leaderboard', async (req, res, next) => {
    try {
      const { filters, activeFilters } = buildScoreFilters(req.query) // Build filters for the leaderboard
      const formattedScores = await scoreService.getLeaderboard(api, filters) // Get leaderboard scores
      const uniqueWordLengths = await scoreService.getUniqueWordLengths(api) // Get unique word lengths

      // Render the leaderboard page
      renderPage(res, 'leaderboard', {
        allScores: formattedScores,
        activeFilters,
        wordLengths: uniqueWordLengths,
      })
    } catch (err) {
      next(err) // Pass errors to the error handler
    }
  })

  // Middleware setup
  app.use(sessionConfig()) // Session management
  app.use(express.json()) // Parse incoming JSON requests

  // API routes
  app.use('/api', apiRoutes(api))

  // Static files
  app.use('/static', express.static('static'))

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error('A server error occurred:', err)

    const status = (err as any).status || 500 // Safely fallback to 500 if status is not defined
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
    renderErrorPage(res, status, 'Technical error', errorMessage)
  }

  app.use(errorHandler) // Now use it as a middleware

  return app // Return the initialized app
}

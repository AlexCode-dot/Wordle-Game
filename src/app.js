import express from 'express'
import { engine } from 'express-handlebars'
import fs from 'fs/promises'
import renderPage from './lib/renderPage.js'
import { renderErrorPage } from './lib/errorHandler.js'
import apiRoutes from './routes/apiRoutes.js'
import sessionConfig from './lib/sessionConfig.js' // Import the session config

export default async function initApp(api) {
  const app = express()

  app.engine('handlebars', engine())
  app.set('view engine', 'handlebars')
  app.set('views', './templates')

  const manifestData = await fs.readFile('static/dist/.vite/manifest.json', 'utf-8')
  const manifest = JSON.parse(manifestData)
  const jsFile = manifest['src/react/main.jsx'] ? manifest['src/react/main.jsx'].file : null

  app.get('/', async (req, res, next) => {
    try {
      renderPage(res, 'play', { jsFile })
    } catch (err) {
      next(err)
    }
  })

  app.get('/about', async (req, res, next) => {
    try {
      renderPage(res, 'about')
    } catch (err) {
      next(err)
    }
  })

  app.get('/leaderboard', async (req, res, next) => {
    try {
      const scoresData = await api.HighScore.find()
      const formattedScores = scoresData.map((score) => ({
        name: score.name,
        guessCount: score.guessCount,
        timeTaken: score.timeTaken,
        rules: score.rules,
      }))

      renderPage(res, 'leaderboard', { allScores: formattedScores })
    } catch (err) {
      next(err)
    }
  })

  app.use(sessionConfig()) // Use the session config here
  app.use(express.json())
  app.use('/api', apiRoutes(api))
  app.use('/static', express.static('static'))

  app.use((req, res) => {
    renderErrorPage(res, 404, 'Page not found', 'The page does not exist')
  })

  app.use((err, request, response, next) => {
    console.error('A server error occurred:', err)

    const status = err.status || 500
    const errorMessage = err.message || 'An unexpected error occurred. Please try again later.'

    if (request.originalUrl.startsWith('/api/')) {
      return response.status(status).json({
        error: errorMessage,
        status,
      })
    }

    renderErrorPage(response, status, 'Technical error', errorMessage)
  })

  return app
}

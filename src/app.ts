import express from 'express'
import { Request, Response, NextFunction } from 'express'
import { engine } from 'express-handlebars'
import fs from 'fs/promises'
import renderPage from './lib/renderPage'
import { renderErrorPage } from './lib/errorHandler'
import apiRoutes from './routes/apiRoutes'
import sessionConfig from './lib/sessionConfig'
import * as scoreService from './services/scoreService'
import { buildScoreFilters } from './services/leaderboardFilters'
import { API } from './types'

export default async function initApp(api: API) {
  const app = express()

  app.engine(
    'handlebars',
    engine({
      helpers: {
        eq: (a: string, b: string) => String(a) === String(b),
      },
    })
  )

  app.set('view engine', 'handlebars')
  app.set('views', './templates')

  const manifestData = await fs.readFile('static/dist/.vite/manifest.json', 'utf-8')
  const manifest = JSON.parse(manifestData)
  const jsFile = manifest['src/react/main.jsx']?.file || null

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
      const { filters, activeFilters } = buildScoreFilters(req.query)
      const formattedScores = await scoreService.getLeaderboard(api, filters)
      const uniqueWordLengths = await scoreService.getUniqueWordLengths(api)

      renderPage(res, 'leaderboard', {
        allScores: formattedScores,
        activeFilters,
        wordLengths: uniqueWordLengths,
      })
    } catch (err) {
      next(err)
    }
  })

  if (process.env.NODE_ENV === 'test') {
    app.get('/api/force-error', (req, res, next) => {
      const err = new Error('Simulated API error')
      ;(err as any).status = 500
      next(err)
    })

    app.get('/throw-error', (req, res, next) => {
      const err = new Error('Simulated SSR crash')
      ;(err as any).status = 500
      next(err)
    })
  }

  app.use(sessionConfig())
  app.use(express.json())
  app.use('/api', apiRoutes(api))
  app.use('/static', express.static('static'))

  app.use((req: Request, res: Response, next: NextFunction): void => {
    if (req.originalUrl.startsWith('/api/')) {
      res.status(404).json({ error: 'Endpoint not found', status: 404 })
    } else {
      renderErrorPage(res, 404, 'Site could not be found', 'Site does not exist')
    }
  })

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('A server error occurred:', err)

    const status = err?.status || 500
    const errorMessage = err.message || 'An unexpected error occurred. Please try again later.'

    if (req.originalUrl.startsWith('/api/')) {
      res.status(status).json({ error: errorMessage, status })
      return
    }

    renderErrorPage(res, status, 'Technical error', errorMessage)
  })

  return app
}

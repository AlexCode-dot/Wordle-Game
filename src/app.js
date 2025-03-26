import express from 'express'
import { engine } from 'express-handlebars'
import fs from 'fs/promises'
import renderPage from './lib/renderPage.js'
import { renderErrorPage } from './lib/errorHandler.js'

export default async function initApp() {
  const app = express()

  app.engine('handlebars', engine())
  app.set('view engine', 'handlebars')
  app.set('views', './templates')

  const manifestData = await fs.readFile('static/dist/.vite/manifest.json', 'utf-8')
  const manifest = JSON.parse(manifestData)
  const jsFile = manifest['src/react/main.jsx'] ? manifest['src/react/main.jsx'].file : null

  app.get('/', async (req, res, next) => {
    try {
      renderPage(res, 'game', { jsFile })
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
      renderPage(res, 'leaderboard')
    } catch (err) {
      next(err)
    }
  })

  app.use('/static', express.static('static'))

  app.use((req, res) => {
    renderErrorPage(res, 404, 'Sidan kunde inte hittas', 'Sidan finns inte')
  })

  app.use((err, req, res, next) => {
    console.error('Ett serverfel inträffade:', err)
    const status = err.status || 500
    renderErrorPage(res, status, 'Tekniskt fel', 'Ett oväntat fel inträffade. Försök igen senare.')
  })

  return app
}

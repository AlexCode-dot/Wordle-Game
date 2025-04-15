import initApp from './app'
import loadWords from './services/fetchWordList'
import HighScore from './models/HighScore'
import './mongoose.js'
import { API } from './types'

const api: API = {
  loadWords,
  HighScore,
}

async function startServer() {
  const app = await initApp(api)
  app.listen(5080)
}

startServer()

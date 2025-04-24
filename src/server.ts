import initApp from './app'
import { loadWords } from './services/fetchWordList'
import HighScore from './models/HighScore'
import { connectToDatabase, isDatabaseConnected } from './mongoose'
import { API } from './types'

const api: API = {
  loadWords,
  HighScore,
}

async function startServer() {
  await connectToDatabase()
  const app = await initApp({ api, dbConnected: isDatabaseConnected() })

  const port = process.env.PORT || 5080
  app.listen(port, () => {
    console.log(`✅ Server listening on port ${port}`)
  })
}

startServer()

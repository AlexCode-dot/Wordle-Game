import initApp from './app.js'
import loadWords from './services/fetchWordList.js'

const api = {
  loadWords,
}
async function startServer() {
  const app = await initApp(api)
  app.listen(5080)
}

startServer()

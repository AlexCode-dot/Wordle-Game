import initApp from './app.js'

async function startServer() {
  const app = await initApp()
  app.listen(5080)
}

startServer()

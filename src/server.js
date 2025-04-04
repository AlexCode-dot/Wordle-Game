import initApp from './app.js'
import loadWords from './services/fetchWordList.js'
import HighScore from './models/HighScore.js';
import './mongoose.js';

const api = {
  loadWords,
  HighScore,
}
async function startServer() {
  const app = await initApp(api)
  app.listen(5080)
}

startServer()

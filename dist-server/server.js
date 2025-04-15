'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const app_1 = __importDefault(require('./app'))
const fetchWordList_1 = __importDefault(require('./services/fetchWordList'))
const HighScore_1 = __importDefault(require('./models/HighScore'))
require('./mongoose.js')
const api = {
  loadWords: fetchWordList_1.default,
  HighScore: HighScore_1.default,
}
async function startServer() {
  const app = await (0, app_1.default)(api)
  app.listen(5080)
}
startServer()

'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.renderErrorPage = renderErrorPage
const renderPage_js_1 = __importDefault(require('./renderPage.js'))
function renderErrorPage(response, status, errorType, message) {
  response.status(status)
  ;(0, renderPage_js_1.default)(response, 'error', {
    status,
    errorType,
    message,
  })
}

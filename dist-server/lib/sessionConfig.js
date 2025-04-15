'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.default = sessionConfig
const express_session_1 = __importDefault(require('express-session'))
const connect_mongo_1 = __importDefault(require('connect-mongo'))
function sessionConfig() {
  return (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-secret',
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/wordgame',
      ttl: 60 * 60,
    }),
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    },
  })
}

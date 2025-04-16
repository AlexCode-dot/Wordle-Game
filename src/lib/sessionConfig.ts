import session from 'express-session'
import MongoStore from 'connect-mongo'

export default function sessionConfig() {
  return session({
    secret: process.env.SESSION_SECRET || 'your-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/wordgame',
      ttl: 60 * 60,
    }),
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    },
  })
}

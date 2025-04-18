import session from 'express-session'
import MongoStore from 'connect-mongo'

const isTestEnv = process.env.NODE_ENV === 'test' || process.argv.some((arg) => arg.includes('cypress'))

export default function sessionConfig() {
  console.log('✅ Using session store:', isTestEnv ? 'MemoryStore' : 'MongoStore')
  return session({
    secret: process.env.SESSION_SECRET || 'your-secret',
    resave: false,
    saveUninitialized: false,
    store: isTestEnv
      ? undefined
      : MongoStore.create({
          mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/wordgame',
          ttl: 60 * 60,
        }),
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    },
  })
}

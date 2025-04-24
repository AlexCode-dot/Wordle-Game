import session from 'express-session'
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'

dotenv.config()

const isTestEnv = process.env.NODE_ENV === 'test' || process.argv.some((arg) => arg.includes('cypress'))

export default function sessionConfig(dbConnected: boolean) {
  const useMongoStore = !isTestEnv && dbConnected
  console.log('✅ Using session store:', useMongoStore ? 'MongoStore' : 'MemoryStore')

  return session({
    secret: process.env.SESSION_SECRET || 'your-secret',
    resave: false,
    saveUninitialized: false,
    store: useMongoStore
      ? MongoStore.create({
          mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/wordgame',
          ttl: 60 * 60,
        })
      : undefined,
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    },
  })
}

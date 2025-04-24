import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

let connected = false

export function isDatabaseConnected() {
  return connected
}
export async function connectToDatabase(
  uri: string = process.env.MONGO_URI || 'mongodb://localhost:27017/wordgame'
): Promise<void> {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    connected = true
    console.log('✅ Connected to MongoDB')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    connected = false
    console.warn('⚠️ Continuing without database connection')
  }
}

export default mongoose

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/wordgame';

mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error('❌ MongoDB connection error:', err));

export default mongoose;

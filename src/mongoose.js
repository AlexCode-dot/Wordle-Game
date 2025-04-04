// mongoose.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load variables from .env

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

export default mongoose;

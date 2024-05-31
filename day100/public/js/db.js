import mongoose from 'mongoose';
import { mongoDBUrl } from './config.js';
const uri = mongoDBUrl;

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other options if needed
    });
    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export default connectDB;

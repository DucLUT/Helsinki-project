import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
let MONGO_URI = process.env.MONGO_URI;
if (process.env.NODE_ENV === 'test') {
  MONGO_URI = process.env.MONGO_URI_TEST;
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // Remove deprecated options
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process if connection fails
  }
};
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
export const clearDB = async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
    console.log('MongoDB Cleared');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
export const dropDB = async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    console.log('MongoDB Dropped');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
export const seedDB = async () => {
  try {
    // Add your seeding logic here
    console.log('MongoDB Seeded');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

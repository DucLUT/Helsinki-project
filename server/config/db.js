import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
let MONGO_URI = process.env.MONGO_URI;
if (process.env.NODE_ENV === 'test') {
  MONGO_URI = process.env.TEST_MONGODB_URI;
}
console.log('Mongo URI:', MONGO_URI);

export const connectDB = async (force = false) => {
  if (mongoose.connection.readyState >= 1 && !force) return;
  if (force && mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
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
    console.log('Clearing database...');
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      console.log(`Clearing collection: ${collection.collectionName}`);
      await collection.deleteMany({});
    }
    console.log('Database cleared successfully.');
  } catch (error) {
    console.error(`Error clearing database: ${error.message}`);
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
    console.log('MongoDB Seeded');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
export { mongoose };

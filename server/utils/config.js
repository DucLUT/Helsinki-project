import dotenv from 'dotenv';
dotenv.config();
console.log("Loaded PORT from .env:", process.env.PORT); 
export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI


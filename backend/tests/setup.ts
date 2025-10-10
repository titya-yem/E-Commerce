import { MongoMemoryServer } from "mongodb-memory-server"; // In-memory MongoDB for testing
import mongoose from "mongoose"; // Mongoose for DB connection
import { beforeAll, afterAll } from "vitest"; // Vitest hooks
import dotenv from 'dotenv';

dotenv.config(); // loads variables from your .env file

let mongo: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongo = await MongoMemoryServer.create();
  
  // Connect Mongoose to the in-memory MongoDB
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  // Close Mongoose connection after tests finish
  await mongoose.connection.close();
  
  // Stop the in-memory MongoDB
  await mongo.stop();
});

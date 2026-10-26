require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

// Fall back to a test-only secret if .env isn't loaded yet in this environment,
// so auth routes (which sign a JWT) don't crash with "secretOrPrivateKey must have a value".
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-only-secret-do-not-use-in-production";
}

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

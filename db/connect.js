
const { MongoClient } = require('mongodb');
require('dotenv').config();

let db = null;

const initDb = async () => {
  if (db) return db;
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
    return db;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const getDb = () => {
  if (!db) throw new Error('Database not initialized');
  return db;
};

module.exports = { initDb, getDb };

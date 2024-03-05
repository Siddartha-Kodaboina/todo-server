const { MongoClient } = require('mongodb');

const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD.trim());
const connectionString = `mongodb+srv://stevesiddu49:${password}@devcluster.konfbv0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(connectionString);

async function connectToDatabase() {
  try {
    await client.connect();
    // console.log("Connected to MongoDB");
    return client.db("datastore"); // Return the database instance
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    process.exit(1);
  }
}

module.exports = connectToDatabase; // Export the function, not its call

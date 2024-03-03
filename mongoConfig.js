const {MongoClient} = require('mongodb');
const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD.trim());
const connectionString = `mongodb+srv://stevesiddu49:${password}@devcluster.konfbv0.mongodb.net/?retryWrites=true&w=majority`; 
const client = new MongoClient(connectionString);

async function connectToDatabase() {
  let conn;
  try {
    conn = await client.connect();
    console.log("Connection successful");
  } catch(e) {
    console.error(e);
    return null;
  }
  return conn.db("datastore");
}

module.exports = connectToDatabase;

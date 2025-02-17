const { MongoClient } = require('mongodb');

console.log(process.env.MONGO_URI);

// Connection URL
const url = process.env.MONGO_URI;

// Database Name
const dbName = 'dwit_job_portal';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function (err) {
  console.log('Connected successfully to MongoDB server');

  const db = client.db(dbName);
  // Use the database connection to perform CRUD operations
  // ...

  client.close();
});

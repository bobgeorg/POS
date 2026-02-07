const mongoose = require("mongoose");
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

// MongoDB connection string - can be configured via environment variable
// Priority: Environment variable > Default local connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/restaurant-pos";

// Remote MongoDB Atlas example (configure in .env file):
// MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/restaurant-pos?retryWrites=true&w=majority

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error(`Connection string: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Hide credentials in logs
    process.exit(1);
  }
};

module.exports = connectDB;

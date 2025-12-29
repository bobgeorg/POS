const mongoose = require("mongoose");
// Remote MongoDB Atlas connections (commented out)
// const MONGO_URI = 'mongodb+srv://vi123:BQH3rijyjtXEPq9T@cluster0.cb3mx.mongodb.net/proshop?retryWrites=true&w=majority'
// const MONGO_URI = "mongodb+srv://hoangkui:1111@pos-cnpm.y3hmx.mongodb.net/test";

// Local MongoDB connection
const MONGO_URI = "mongodb://localhost:27017/restaurant-pos";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // ? .red.underline.bold , .cyan.underline are from colors package
    process.exit(1);
  }
};

module.exports = connectDB;

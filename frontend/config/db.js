const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI not set in .env');
    }
    const conn = await mongoose.connect(uri);
    console.log('MongoDB Connected: ' + conn.connection.host);
  } catch (err) {
    console.error('DB Error (check MONGO_URI in .env):', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

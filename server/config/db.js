const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = "mongodb://souravkaransagar_db_user:SouravKaran9500@ac-erj6dql-shard-00-00.ulutibe.mongodb.net:27017,ac-erj6dql-shard-00-01.ulutibe.mongodb.net:27017,ac-erj6dql-shard-00-02.ulutibe.mongodb.net:27017/?ssl=true&replicaSet=atlas-108lqn-shard-0&authSource=admin&appName=Cluster0";
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
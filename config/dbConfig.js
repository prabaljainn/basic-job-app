const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Your DB is connected! 🚀 ");
    })
    .catch((err) => {
      console.log("DB Connection 😢 Error: ", err);
      process.exit(1);
    });
};

module.exports = connectDB;

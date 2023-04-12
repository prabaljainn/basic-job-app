require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConfig");
connectDB();
const app = express();
app.use(express.json());

module.exports = app;

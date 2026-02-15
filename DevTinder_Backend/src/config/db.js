const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/devTinder");
    console.log("Connection established");
  } catch (err) {
    console.log("Connection failed while connecting to DB", err);
    process.exit(1); //Stop server if DB fails
  }
};

module.exports = connectDb;

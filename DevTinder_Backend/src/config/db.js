const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/devTinder");
    console.log("Connection established");
  } catch (err) {
    console.log("Connection failed while connecting to DB");
    process.exit(1); //Stop server if DB fails
  }
};

module.exports = connectDb;

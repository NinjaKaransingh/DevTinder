const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"], 
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://ongcvidesh.com/wp-content/uploads/2019/08/dummy-image.jpg",
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
    skills: {
      tyep: [String],
    },
  },
  { timestamps: true } 
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

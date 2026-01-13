const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
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
      validate(value) {
        if (!validator.isEmail(value)) {
          console.log("Hellow");
          throw new Error("Invalid Email address :  " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
            value
          );
        },
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL address" + value);
        }
      },
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

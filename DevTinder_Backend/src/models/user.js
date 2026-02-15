const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      // validate: {
      //   validator: function (value) {
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
      //       value
      //     );
      //   },
      //   message:
      //     "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      // },

      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
      select: false, //select: false hides the password by default,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
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
      type: [String],
    },
  },
  { timestamps: true },
);

UserSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "Dev@Tinder790", {
    expiresIn: "30s",
  });

  return token;
};

UserSchema.methods.isPasswordValid = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashedPassword);
  return isPasswordValid;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;

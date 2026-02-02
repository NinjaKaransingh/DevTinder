const express = require("express");
const connectDb = require("./config/db.js");
const bcrypt = require("bcrypt");
const User = require("./models/user.js");
const {
  validateSignUpData,
  validateLoginData,
} = require("./utils/validation.js");
const { userAuth } = require("./middlewares/auth.js");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json()); //this is a middleware in express that allows the server to read the JSON data sent from the client

// 1. parses the JSON
// 2. Converts it to JavaScript Object
// 3. puts it inside req.body

// Parses the Cookie header from incoming HTTP requests

// Attaches parsed cookies to: req.cookies -> to read the cookie
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("Everytime this will be logged on every API call");
  next();
});

app.get("/", (req, res) => {
  res.send("Connected");
});

//To create a new user and saving it to the database
app.post("/signup", async (req, res) => {
  // const user = new User({
  //   firstName: "Karansingh B",
  //   lastName: "Borde",
  //   age: 26,
  //   password: "Karan@123",
  //   gender: "Male",
  // });

  try {
    // 1. Validation of the data like check whether firstname, lastname, age, password every each possible validation
    validateSignUpData(req);

    // 2. Encrypt the password
    // bcrypt.genSalt(10, function (err, salt) {
    //   bcrypt.hash("Karan@123", salt, function (err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    //   });
    // });
    const {
      firstName,
      lastName,
      password,
      age,
      gender,
      emailId,
      photoUrl,
      about,
      skills,
    } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //3. Creating new instance of a user model

    // const user = new User(req.body); //bad way of creating a new instance

    const user = new User({
      firstName,
      lastName,
      password: hashedPassword,
      age,
      gender,
      emailId,
      photoUrl,
      about,
      skills,
    });
    await user.save();

    res.status(201).json({
      message: "User details added successfully",
      user: {
        firstName,
        lastName,
        emailId,
        age,
        gender,
      },
    });
  } catch (err) {
    // Duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email id already exists",
      });
    }

    // Mongoose validation error ->
    // Catches enum/min/required errors, Acts as final safety net
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      message: "Error while saving the details",
      error: err.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    validateLoginData(req);

    const { emailId, password } = req.body;

    // select: false hides the password by default, and .select("+password") temporarily includes it only when absolutely needed.
    const user = await User.findOne({ emailId: emailId }).select("+password"); //returns the single object that contains the document

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // creating the jwt token -> jwt.sign({hiding part inside the token that can be user id or anything}"JWT_SECRET_KEY");

    const token = jwt.sign({ _id: user._id }, "Dev@Tinder790");


    // res.cookie("token", token); -> 
    // By default:❌ Accessible by JS,❌ Sent over HTTP,❌ Vulnerable to XSS
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    }); //sends the token wrapped inside the cookie

    return res.status(200).json({
      message: "Login successful",
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      // error: err.message,
    });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
});

//To get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    //if we are using find method then this will return array
    // but if we are using findOne method then this will return an object

    // const userEmailId = req.body.emailId;
    // try{

    // const user =await User.findOne({emailId : userEmailId});

    //   if(user){
    //  res.send(user);
    //    }
    //   else{
    // res.status(404).send("No user found");
    //    }
    // }

    // catch(err){
    // res.status(400).send("Something went wrong");
    // }

    if (users.length === 0) {
      res.status(404).send("No user found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//To delete a user from the database
app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    // User.findByIdAndDelete(condition, options); // It will take 2 parameters where 1st is the condition to find the document and 2nd is options object
    // const user = await User.findByIdAndDelete({id : userId});
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

//To update the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updatedData = req.body;

  try {
    const updates = Object.keys(updatedData);
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = updates.every((update) => {
      return ALLOWED_UPDATES.includes(update);
    });

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (Array.isArray(updatedData?.skills)) {
      if (updatedData?.skills.length > 10) {
        throw new Error("Skills cannot be more than 10");
      }
    }

    // const user = user.findByIdAndUpdate(condition,req body,options);
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true, // return updated document (replaced by returnDocument : true)
      runValidators: true, // apply schema validation
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User details updated successfully",
      user,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email id already exists",
      });
    }
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

connectDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is listening on PORT 3000");
    });
  })
  .catch((err) => {
    console.log("Connection failed ");
  });

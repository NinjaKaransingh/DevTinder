const express = require("express");
const connectDb = require("./config/db.js");
const User = require("./models/user.js");

const app = express();
app.use(express.json()); //this is a middleware in express that allows the server to read the JSON data sent from the client

// 1. parses the JSON
// 2. Converts it to JavaScript Object
// 3. puts it inside req.body

app.use((req, res, next) => {
  console.log("Hi");
  next();
});

app.get("/", (req, res) => {
  res.send("Connected");
});

//To create a new user and saving it to the database
app.post("/signup", async (req, res) => {
  // console.log(req.body);
  // const user = new User({
  //   firstName: "Karansingh B",
  //   lastName: "Borde",
  //   age: 26,
  //   password: "Karan@123",
  //   gender: "Male",
  // });

  // creating new instance of a user model

  try {
    const { firstName, emailId, password } = req.body;

    //Basic Validation
    if (!firstName || !emailId || !password) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      message: "User details added successfully",
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
    console.log(id);
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
app.patch("/user", async (req, res) => {
  const { userId, ...updatedData } = req.body;

  console.log(updatedData);

  // const user = user.findByIdAndUpdate(condition,req body,options);
  try {
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

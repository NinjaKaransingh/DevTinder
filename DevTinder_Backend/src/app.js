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
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User details added successfully");
  } catch (err) {
    res.status(400).send("Error while saving the details");
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.findOne({});

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

connectDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is listening on PORT 3000");
    });
  })
  .catch((err) => {
    console.log("Connection failed ");
  });

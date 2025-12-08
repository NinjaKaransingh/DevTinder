const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express(); // instance of express js application

//1. This will only handle GET call to /hello
// app.get("/user", (req, res) => {
//   res.send({
//     firstName: "Karansingh B",
//     lastName: "Borde",
//   });
// });

//This will match all the HTTP method API calls to /hello
// app.use("/user", (req, res) => {
//   res.send("Hello from the server");
// });

// app.use((req, res) => {
//   res.send("Hello from the server!");
// });

// (req, res) => { => this entire piece of code is known as request handler
//   res.send("Hello from the server!");
// }

//2. Optional routes
// app.get(/^\/ab?c$/, (req, res) => {
//   // /ac or /abc
//   res.send({
//     firstName: "Karansingh B",
//     lastName: "Borde",
//   });
// });

// app.get(/^\/abc\/?$/, (req, res) => {
//   //http://localhost:3000/abc or http://localhost:3000/abc/
//   res.send("Login");
// });

// app.get(/^\/ab+ce$/, (req, res) => {
//   //http://localhost:3000/abbbbce -> '+' means we can add multiple b's in the url
//   res.send("abc");
// });

// app.get("/ab*cd", (req, res) => {
//   //absdjsndncd - it means it should start with ab and ends with cd in between we can add anything
//   res.send("abcd");
// });

// 3. Query(?) parameter and path parameter(/user/101)
// app.get("/user", (req, res) => {
//   console.log(req.query);
//   res.send({
//     firstName: "Karansingh",
//     lastName: "Borde",
//   });
// });

// app.get("/user/:userId/:userName", (req, res) => {
//   //Params
//   console.log(req.params);
//   res.send("Params");
// });

//4. Middlewares
// a.
// app.use("/admin", adminAuth);

// app.get("/admin/getAllData", (req, res) => {
//   res.send("All Data Sent");
// });

// app.delete("/admin/deleteUser", (req, res) => {
//   res.send("Deleted a user");
// });

// app.get("/user", userAuth, (req, res) => {
//   res.send("User Data Sent");
// });

// app.get("/user/login", (req, res) => {
//   res.send("User LoggedIn Successsfully");
// });

// b.error handling

app.get("/getUserData", (req, res) => {
  //while fetching data from db /if any code error is there then it needs to be handled gracefully

  // it is good practice to have try catch block in every request route handler
  try {
    throw new Error("smbsdmb");
  } catch (err) {
    res.status(500).send("Some Error Contact Support Team!");
  }
});

app.use("/", (err, req, res, next) => {
  // keep this in the end of the code
  // If we miss try catch block then it will come to this route handler block
  if (err) {
    //log your error message
    res.status(500).send("something went wrong");
  }
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});

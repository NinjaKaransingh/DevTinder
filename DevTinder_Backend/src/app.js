const express = require("express");

const app = express(); // instance of express js application

//This will only handle GET call to /hello
// app.get("/user", (req, res) => {
//   res.send({
//     firstName: "Karansingh B",
//     lastName: "Borde",
//   });
// });

//optional routes
app.get(/^\/ab?c$/, (req, res) => {
  // /ac or /abc
  res.send({
    firstName: "Karansingh B",
    lastName: "Borde",
  });
});

app.get(/^\/abc\/?$/, (req, res) => {
  //http://localhost:3000/abc or http://localhost:3000/abc/
  res.send("Login");
});

app.get(/^\/ab+ce$/, (req, res) => {
  //http://localhost:3000/abbbbce -> '+' means we can add multiple b's in the url
  res.send("abc");
});

app.get("/ab*cd", (req, res) => {
  //absdjsndncd - it means it should start with ab and ends with cd in between we can add anything
  res.send("abcd");
});

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send({
    firstName: "Karansingh",
    lastName: "Borde",
  });
});

app.get("/user/:userId/:userName", (req, res) => {
  //Params
  console.log(req.params);
  res.send("Params");
});

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

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});

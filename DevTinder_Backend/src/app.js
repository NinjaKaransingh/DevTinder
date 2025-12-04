const express = require("express");

const app = express(); // instance of express js application

app.get("/", (req, res) => {
  res.send("Hello from the dashboard!");
});

app.get("/hello", (req, res) => {
  res.send("Hello hello hello");
});

app.get("/test", (req, res) => {
  res.send("Hello from the server!");
});

// app.use((req, res) => {
//   res.send("Hello from the server!");
// });

// (req, res) => { => this entire piece of code is known as request handler
//   res.send("Hello from the server!");
// }

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});

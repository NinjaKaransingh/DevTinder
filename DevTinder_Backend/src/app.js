const express = require("express");

const app = express(); // instance of express js application

app.get("/", (req, res) => {
  res.send("Hello from the dashboard!");
});

//This will only handle GET call to /hello
app.get("/user", (req, res) => {
  res.send({
    firstName: "Karansingh B",
    lastName: "Borde",
  });
});

app.post("/user", (req, res) => {
  //saving data to DB
  res.send("Data successfully saved to the database");
});

app.delete("/user", (req, res) => {
  res.send("User Deleted successfully");
});

//This will match all the HTTP method API calls to /hello
app.use("/user", (req, res) => {
  res.send("Hello from the server");
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

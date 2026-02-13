const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
  try {
    // Read the token request cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // Validate the token
    const decodedToken = jwt.verify(token, "Dev@Tinder790");

    const { _id } = decodedToken;

    // Find the user
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    req.user = user; //attaching the user object to the request, so that it can be accessed in get api and to sending the user object
    next(); // this will call next request function
  } catch (err) {
    if (err.name == "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({
      message: "Error while verifying the token",
    });
  }
};

module.exports = { userAuth };

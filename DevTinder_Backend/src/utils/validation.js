const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("Please enter the first name");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name should be 4 to 50 characters =");
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email Id is not valid");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }

  return true;
};

const validateLoginData = (req) => {
  const { emailId } = req.body;
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Invalid credentials");
  }
};

module.exports = { validateSignUpData, validateLoginData };

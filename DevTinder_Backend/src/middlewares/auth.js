const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).send("User not authorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "xyaz";
  const isAdminAuthorized = token === "xyz";

  if (!isAdminAuthorized) {
    res.status(401).send("User not authorized");
  } else {
    next();
  }
};

module.exports = { adminAuth , userAuth};

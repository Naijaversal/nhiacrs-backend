const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const isAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (req.user && req.user.role === "Admin") {
    // User has an "admin" role, allow access to the route
    next();
  } else {
    // User is not an admin, deny access
    res.status(403).json({ message: "Access denied. Admin role required." });
  }
});

module.exports = isAdmin;

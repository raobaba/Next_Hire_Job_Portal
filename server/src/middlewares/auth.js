const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncErrorHandler = require("./asyncErrorHandler");

const isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // Check if the header contains the "Bearer" token format
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Authorization token missing or malformed" });
  }

  const token = parts[1];

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid token or user not found" });
    }
    
    // Assign user to req.user for further use
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = isAuthenticatedUser;


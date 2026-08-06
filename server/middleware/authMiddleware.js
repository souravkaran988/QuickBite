const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Route — Check if user is logged in
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in request headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token found → block the request
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from database using decoded token
    const user = await User.findById(decoded.id).select("-password");

    // If user not found → block the request
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    // Attach user to request object
    req.user = user;

    // Move to next function
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};

// Admin Only Route — Check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Not authorized, admin access only",
    });
  }
};

module.exports = { protect, adminOnly };
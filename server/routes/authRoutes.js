const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  registerUser,
  loginUser,
  getMe,
  googleCallback,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Register new user
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login user
router.post("/login", loginUser);

// @route   GET /api/auth/me
// @desc    Get logged in user
router.get("/me", protect, getMe);

// @route   GET /api/auth/google
// @desc    Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

module.exports = router;
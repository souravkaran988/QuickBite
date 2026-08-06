const express = require("express");
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/payment/create-order
// @desc    Create Razorpay payment order — Private
router.post("/create-order", protect, createPaymentOrder);

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment — Private
router.post("/verify", protect, verifyPayment);

module.exports = router;
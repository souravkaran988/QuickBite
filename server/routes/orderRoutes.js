const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// @route   POST /api/orders
// @desc    Place a new order — Private
router.post("/", protect, placeOrder);

// @route   GET /api/orders/my-orders
// @desc    Get all orders of logged in user — Private
router.get("/my-orders", protect, getMyOrders);

// @route   GET /api/orders
// @desc    Get all orders — Admin Only
router.get("/", protect, adminOnly, getAllOrders);

// @route   GET /api/orders/:id
// @desc    Get single order by ID — Private
router.get("/:id", protect, getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Update order status — Admin Only
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order — Private
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
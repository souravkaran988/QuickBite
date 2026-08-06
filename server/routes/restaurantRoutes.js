const express = require("express");
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
} = require("../controllers/restaurantController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { handleUpload } = require("../middleware/uploadMiddleware");

// @route   GET /api/restaurants
// @desc    Get all restaurants — Public
router.get("/", getAllRestaurants);

// @route   GET /api/restaurants/:id
// @desc    Get single restaurant — Public
router.get("/:id", getRestaurantById);

// @route   POST /api/restaurants
// @desc    Create restaurant — Admin Only
router.post("/", protect, adminOnly, handleUpload, createRestaurant);

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant — Admin Only
router.put("/:id", protect, adminOnly, handleUpload, updateRestaurant);

// @route   DELETE /api/restaurants/:id
// @desc    Delete restaurant — Admin Only
router.delete("/:id", protect, adminOnly, deleteRestaurant);

// @route   PUT /api/restaurants/:id/toggle-status
// @desc    Toggle restaurant open/close — Admin Only
router.put("/:id/toggle-status", protect, adminOnly, toggleRestaurantStatus);

module.exports = router;
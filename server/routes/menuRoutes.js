const express = require("express");
const router = express.Router();
const {
  getMenuByRestaurant,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} = require("../controllers/menuController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { handleUpload } = require("../middleware/uploadMiddleware");

// @route   GET /api/menu/:restaurantId
// @desc    Get all menu items of a restaurant — Public
router.get("/:restaurantId", getMenuByRestaurant);

// @route   GET /api/menu/item/:id
// @desc    Get single menu item — Public
router.get("/item/:id", getMenuItemById);

// @route   POST /api/menu
// @desc    Create menu item — Admin Only
router.post("/", protect, adminOnly, handleUpload, createMenuItem);

// @route   PUT /api/menu/:id
// @desc    Update menu item — Admin Only
router.put("/:id", protect, adminOnly, handleUpload, updateMenuItem);

// @route   DELETE /api/menu/:id
// @desc    Delete menu item — Admin Only
router.delete("/:id", protect, adminOnly, deleteMenuItem);

// @route   PUT /api/menu/:id/toggle-availability
// @desc    Toggle menu item availability — Admin Only
router.put("/:id/toggle-availability", protect, adminOnly, toggleAvailability);

module.exports = router;
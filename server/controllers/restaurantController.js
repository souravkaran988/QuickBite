const Restaurant = require("../models/Restaurant");

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      cuisine,
      address,
      phone,
      email,
      openingHours,
      deliveryTime,
      minimumOrder,
      deliveryCharge,
    } = req.body;

    // Get image URL from Cloudinary if uploaded
    const image = req.file ? req.file.path : null;

    // Create restaurant
    const restaurant = await Restaurant.create({
      name,
      description,
      cuisine: JSON.parse(cuisine),
      address: JSON.parse(address),
      phone,
      email,
      openingHours: openingHours ? JSON.parse(openingHours) : undefined,
      deliveryTime,
      minimumOrder,
      deliveryCharge,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
const updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Get image URL from Cloudinary if new image uploaded
    const image = req.file ? req.file.path : restaurant.image;

    // Parse JSON fields if provided
    const updateData = {
      ...req.body,
      image,
    };

    if (req.body.cuisine) updateData.cuisine = JSON.parse(req.body.cuisine);
    if (req.body.address) updateData.address = JSON.parse(req.body.address);
    if (req.body.openingHours) updateData.openingHours = JSON.parse(req.body.openingHours);

    restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await Restaurant.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle restaurant open/close status
// @route   PUT /api/restaurants/:id/toggle-status
// @access  Private/Admin
const toggleRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: `Restaurant is now ${restaurant.isOpen ? "Open" : "Closed"}`,
      data: restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
};
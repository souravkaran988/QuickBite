const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

// @desc    Get all menu items of a restaurant
// @route   GET /api/menu/:restaurantId
// @access  Public
const getMenuByRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const menuItems = await MenuItem.find({
      restaurant: req.params.restaurantId,
    }).sort({ category: 1 });

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/item/:id
// @access  Public
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate(
      "restaurant",
      "name address"
    );
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
  try {
    const {
      restaurant,
      name,
      description,
      price,
      category,
      isVeg,
      isAvailable,
      isBestseller,
    } = req.body;

    // Check if restaurant exists
    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Get image URL from Cloudinary if uploaded
    const image = req.file ? req.file.path : null;

    const menuItem = await MenuItem.create({
      restaurant,
      name,
      description,
      price,
      category,
      isVeg: isVeg === "true" || isVeg === true,
      isAvailable: isAvailable === "true" || isAvailable === true,
      isBestseller: isBestseller === "true" || isBestseller === true,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Get image URL from Cloudinary if new image uploaded
    const image = req.file ? req.file.path : menuItem.image;

    const updateData = { ...req.body, image };

    if (req.body.isVeg !== undefined)
      updateData.isVeg = req.body.isVeg === "true" || req.body.isVeg === true;
    if (req.body.isAvailable !== undefined)
      updateData.isAvailable =
        req.body.isAvailable === "true" || req.body.isAvailable === true;
    if (req.body.isBestseller !== undefined)
      updateData.isBestseller =
        req.body.isBestseller === "true" || req.body.isBestseller === true;

    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle menu item availability
// @route   PUT /api/menu/:id/toggle-availability
// @access  Private/Admin
const toggleAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    return res.status(200).json({
      success: true,
      message: `Menu item is now ${
        menuItem.isAvailable ? "Available" : "Unavailable"
      }`,
      data: menuItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMenuByRestaurant,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaClock, FaMotorcycle, FaPlus, FaMinus } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addToCart, removeFromCart } from "../redux/slices/cartSlice";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const RestaurantDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items, restaurantId } = useSelector((state) => state.cart);

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        axiosInstance.get(`/restaurants/${id}`),
        axiosInstance.get(`/menu/${id}`),
      ]);

      if (restaurantRes.data.success) {
        setRestaurant(restaurantRes.data.data);
      }

      if (menuRes.data.success) {
        setMenuItems(menuRes.data.data);
        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(menuRes.data.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      toast.error("Failed to load restaurant details!");
    } finally {
      setLoading(false);
    }
  };

  // Get quantity of item in cart
  const getItemQuantity = (itemId) => {
    const cartItem = items.find((i) => i._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item) => {
    // Check if cart has items from different restaurant
    if (restaurantId && restaurantId !== id) {
      toast(
        "Your cart has items from another restaurant. Adding this will clear your cart.",
        { icon: "⚠️" }
      );
    }
    dispatch(
      addToCart({
        item,
        restaurantId: id,
        restaurantName: restaurant?.name,
      })
    );
    toast.success(`${item.name} added to cart!`);
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  // Filter menu items by category
  const filteredMenuItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-500 text-xl">Restaurant not found!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Restaurant Header */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={restaurant.image || "https://via.placeholder.com/1200x400?text=Restaurant"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-gray-300 mb-2">{restaurant.cuisine.join(", ")}</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <FaStar className="text-yellow-400" />
                <span>{restaurant.rating || "New"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaClock />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaMotorcycle />
                <span>
                  {restaurant.deliveryCharge === 0
                    ? "Free Delivery"
                    : `₹${restaurant.deliveryCharge} delivery`}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  restaurant.isOpen
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Address */}
        <div className="flex items-center space-x-2 text-gray-500 mb-6">
          <MdLocationOn className="text-primary-500 text-xl" />
          <span>
            {restaurant.address.street}, {restaurant.address.city},{" "}
            {restaurant.address.state} - {restaurant.address.pincode}
          </span>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-3 overflow-x-auto pb-3 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeCategory === category
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No items available!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenuItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex space-x-4"
              >
                {/* Item Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image || "https://via.placeholder.com/100?text=Food"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        {/* Veg/Non-veg indicator */}
                        <span
                          className={`w-4 h-4 border-2 flex items-center justify-center ${
                            item.isVeg
                              ? "border-green-500"
                              : "border-red-500"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.isVeg ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></span>
                        </span>
                        {item.isBestseller && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-primary-500 font-bold">
                        ₹{item.price}
                      </p>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Add/Remove Buttons */}
                  {!item.isAvailable ? (
                    <span className="text-red-400 text-sm">Not available</span>
                  ) : getItemQuantity(item._id) === 0 ? (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-2 bg-primary-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => handleRemoveFromCart(item._id)}
                        className="bg-primary-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="font-bold text-gray-800">
                        {getItemQuantity(item._id)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-primary-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantDetail;
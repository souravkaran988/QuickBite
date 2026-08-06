import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaClock, FaMotorcycle } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.some((c) =>
            c.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const { data } = await axiosInstance.get("/restaurants");
      if (data.success) {
        setRestaurants(data.data);
        setFilteredRestaurants(data.data);
      }
    } catch (error) {
      toast.error("Failed to load restaurants!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hungry? We've Got You! 🍔
          </h1>
          <p className="text-xl mb-8 text-orange-100">
            Order from the best restaurants in your city
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl" />
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 text-lg focus:outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {searchQuery
            ? `Results for "${searchQuery}"`
            : "All Restaurants"}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No restaurants found 😔</p>
            <p className="text-gray-400 mt-2">Try a different search!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link
                to={`/restaurant/${restaurant._id}`}
                key={restaurant._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                {/* Restaurant Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image || "https://via.placeholder.com/400x200?text=Restaurant"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Open/Closed Badge */}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      restaurant.isOpen
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {restaurant.isOpen ? "Open" : "Closed"}
                  </span>
                </div>

                {/* Restaurant Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {restaurant.cuisine.join(", ")}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400" />
                      <span>{restaurant.rating || "New"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-primary-500" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaMotorcycle className="text-primary-500" />
                      <span>
                        {restaurant.deliveryCharge === 0
                          ? "Free Delivery"
                          : `₹${restaurant.deliveryCharge}`}
                      </span>
                    </div>
                  </div>

                  {/* Min Order */}
                  {restaurant.minimumOrder > 0 && (
                    <p className="text-gray-400 text-xs mt-2">
                      Min. order: ₹{restaurant.minimumOrder}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaMotorcycle } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders/my-orders");
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      toast.error("Failed to load orders!");
    } finally {
      setLoading(false);
    }
  };

  // Check if payment failed (Pending payment + older than 30 mins)
  const isPaymentFailed = (order) => {
    if (order.paymentStatus === "Pending" && order.orderStatus === "Pending") {
      const createdAt = new Date(order.createdAt);
      const now = new Date();
      const diffInMinutes = (now - createdAt) / (1000 * 60);
      return diffInMinutes > 30;
    }
    return false;
  };

  // Get display status
  const getDisplayStatus = (order) => {
    if (isPaymentFailed(order)) return "Payment Failed";
    return order.orderStatus;
  };

  const getStatusColor = (order) => {
    const status = getDisplayStatus(order);
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      case "Payment Failed":
        return "bg-red-100 text-red-600";
      case "Out for Delivery":
        return "bg-blue-100 text-blue-600";
      case "Preparing":
        return "bg-yellow-100 text-yellow-600";
      case "Confirmed":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-orange-100 text-orange-600";
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <MdRestaurant className="text-gray-300 text-8xl mx-auto mb-4" />
            <p className="text-gray-500 text-xl mb-2">No orders yet!</p>
            <p className="text-gray-400 mb-6">
              Start ordering from your favourite restaurants.
            </p>
            <Link
              to="/"
              className="bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                to={isPaymentFailed(order) ? "#" : `/order/${order._id}`}
                key={order._id}
                className={`block bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition ${
                  isPaymentFailed(order)
                    ? "opacity-70 cursor-not-allowed border-red-100"
                    : "hover:shadow-md"
                }`}
                onClick={(e) => isPaymentFailed(order) && e.preventDefault()}
              >
                <div className="flex items-start justify-between mb-3">
                  {/* Restaurant Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <img
                        src={
                          order.restaurant?.image ||
                          "https://via.placeholder.com/50?text=R"
                        }
                        alt={order.restaurant?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {order.restaurant?.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order
                    )}`}
                  >
                    {getDisplayStatus(order) === "Payment Failed" ? "❌ Payment Failed" : getDisplayStatus(order)}
                  </span>
                </div>

                {/* Payment Failed Message */}
                {isPaymentFailed(order) && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-2 mb-3">
                    <p className="text-red-500 text-xs">
                      ⚠️ Payment was not completed for this order. Please place a new order.
                    </p>
                  </div>
                )}

                {/* Order Items */}
                <p className="text-gray-500 text-sm mb-3">
                  {order.items.map((item) => item.name).join(", ")}
                </p>

                {/* Order Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-400 text-sm">
                    <div className="flex items-center space-x-1">
                      <FaClock />
                      <span>{order.estimatedDeliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaMotorcycle />
                      <span>₹{order.deliveryCharge} delivery</span>
                    </div>
                  </div>
                  <p className="font-bold text-gray-800">
                    ₹{order.totalAmount}
                  </p>
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

export default OrderHistory;
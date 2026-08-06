import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStore, FaShoppingBag, FaMoneyBillWave, FaTimesCircle } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axiosInstance from "../../utils/axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    confirmedOrders: 0,
    totalRevenue: 0,
    cancelledOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Check if order payment failed (Pending + older than 30 mins)
  const isPaymentFailed = (order) => {
    if (order.paymentStatus === "Pending" && order.orderStatus === "Pending") {
      const createdAt = new Date(order.createdAt);
      const now = new Date();
      const diffInMinutes = (now - createdAt) / (1000 * 60);
      return diffInMinutes > 30;
    }
    return false;
  };

  const fetchDashboardData = async () => {
    try {
      const [restaurantsRes, ordersRes] = await Promise.all([
        axiosInstance.get("/restaurants"),
        axiosInstance.get("/orders"),
      ]);

      const restaurants = restaurantsRes.data.data || [];
      const orders = ordersRes.data.data || [];

      // Confirmed orders — paid and not cancelled
      const confirmedOrders = orders.filter(
        (o) =>
          o.paymentStatus === "Paid" &&
          o.orderStatus !== "Cancelled"
      ).length;

      // Total revenue — only from paid orders
      const totalRevenue = orders
        .filter((o) => o.paymentStatus === "Paid")
        .reduce((sum, o) => sum + o.totalAmount, 0);

      // Cancelled orders — cancelled + payment failed
      const cancelledOrders = orders.filter(
        (o) => o.orderStatus === "Cancelled" || isPaymentFailed(o)
      ).length;

      setStats({
        totalRestaurants: restaurants.length,
        confirmedOrders,
        totalRevenue,
        cancelledOrders,
      });

      // Get 5 most recent orders
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      toast.error("Failed to load dashboard data!");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Cancelled":
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

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Restaurants */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="bg-orange-100 p-3 rounded-xl w-fit mb-4">
              <FaStore className="text-primary-500 text-xl" />
            </div>
            <p className="text-gray-500 text-sm">Total Restaurants</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {stats.totalRestaurants}
            </p>
          </div>

          {/* Confirmed Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="bg-blue-100 p-3 rounded-xl w-fit mb-4">
              <FaShoppingBag className="text-blue-500 text-xl" />
            </div>
            <p className="text-gray-500 text-sm">Confirmed Orders</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {stats.confirmedOrders}
            </p>
            <p className="text-green-500 text-xs mt-1">✅ Paid & Active</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="bg-green-100 p-3 rounded-xl w-fit mb-4">
              <FaMoneyBillWave className="text-green-500 text-xl" />
            </div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              ₹{stats.totalRevenue}
            </p>
            <p className="text-green-500 text-xs mt-1">✅ From paid orders</p>
          </div>

          {/* Cancelled / Failed Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="bg-red-100 p-3 rounded-xl w-fit mb-4">
              <FaTimesCircle className="text-red-500 text-xl" />
            </div>
            <p className="text-gray-500 text-sm">Cancelled / Failed</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {stats.cancelledOrders}
            </p>
            <p className="text-red-400 text-xs mt-1">❌ Cancelled + Payment Failed</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            to="/admin/restaurants"
            className="bg-primary-500 text-white rounded-xl p-4 text-center font-semibold hover:bg-primary-600 transition"
          >
            Manage Restaurants
          </Link>
          <Link
            to="/admin/orders"
            className="bg-blue-500 text-white rounded-xl p-4 text-center font-semibold hover:bg-blue-600 transition"
          >
            Manage Orders
          </Link>
          <Link
            to="/"
            className="bg-gray-700 text-white rounded-xl p-4 text-center font-semibold hover:bg-gray-800 transition"
          >
            View Website
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-primary-500 text-sm hover:underline"
            >
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No orders yet!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="text-left py-3">Order ID</th>
                    <th className="text-left py-3">Customer</th>
                    <th className="text-left py-3">Restaurant</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Payment</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 text-gray-500">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="py-3 text-gray-800 font-medium">
                        {order.user?.name || "N/A"}
                      </td>
                      <td className="py-3 text-gray-600">
                        {order.restaurant?.name || "N/A"}
                      </td>
                      <td className="py-3 font-semibold text-gray-800">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
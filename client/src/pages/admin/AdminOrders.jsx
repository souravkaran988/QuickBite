import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axiosInstance from "../../utils/axios";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const statusOptions = [
    "All",
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders");
      if (data.success) setOrders(data.data);
    } catch (error) {
      toast.error("Failed to load orders!");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await axiosInstance.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
      if (data.success) {
        toast.success("Order status updated!");
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to update status!");
    } finally {
      setUpdatingId(null);
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

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.orderStatus === filterStatus);

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
          Manage Orders
        </h1>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-3 mb-6">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                filterStatus === status
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
              {status !== "All" && (
                <span className="ml-1">
                  ({orders.filter((o) => o.orderStatus === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No orders found!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="font-bold text-gray-800 text-lg">
                      {order.restaurant?.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Customer: {order.user?.name} ({order.user?.email})
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-lg">
                      ₹{order.totalAmount}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <p
                      className={`text-xs mt-1 ${
                        order.paymentStatus === "Paid"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600 py-1"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                <p className="text-gray-500 text-sm mb-4">
                  📍 {order.deliveryAddress.street},{" "}
                  {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.pincode}
                </p>

                {/* Update Status */}
                {order.orderStatus !== "Delivered" &&
                  order.orderStatus !== "Cancelled" && (
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600 text-sm font-medium">
                        Update Status:
                      </span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        disabled={updatingId === order._id}
                        className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 disabled:opacity-50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      {updatingId === order._id && (
                        <div className="spinner"></div>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminOrders;
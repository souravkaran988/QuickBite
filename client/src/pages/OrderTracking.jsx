import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaClock, FaMotorcycle, FaBox } from "react-icons/fa";
import { MdLocationOn, MdRestaurant } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const OrderTracking = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchOrder();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await axiosInstance.get(`/orders/${id}`);
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      toast.error("Failed to load order!");
    } finally {
      setLoading(false);
    }
  };

  // Get next status
  const getNextStatus = (currentStatus) => {
    const flow = {
      "Confirmed": "Preparing",
      "Preparing": "Out for Delivery",
      "Out for Delivery": "Delivered",
    };
    return flow[currentStatus] || null;
  };

  // Simulate next delivery step — Admin Only
  const handleSimulateDelivery = async () => {
    const nextStatus = getNextStatus(order.orderStatus);
    if (!nextStatus) {
      toast.error("Order is already delivered!");
      return;
    }

    setSimulating(true);
    try {
      const { data } = await axiosInstance.put(`/orders/${id}/status`, {
        orderStatus: nextStatus,
      });
      if (data.success) {
        toast.success(`Order status updated to: ${nextStatus} ✅`);
        fetchOrder();
      }
    } catch (error) {
      toast.error("Failed to update order status!");
    } finally {
      setSimulating(false);
    }
  };

  // Order status steps
  const statusSteps = [
    { key: "Pending", label: "Order Placed", icon: <FaBox /> },
    { key: "Confirmed", label: "Confirmed", icon: <FaCheckCircle /> },
    { key: "Preparing", label: "Preparing", icon: <MdRestaurant /> },
    { key: "Out for Delivery", label: "Out for Delivery", icon: <FaMotorcycle /> },
    { key: "Delivered", label: "Delivered", icon: <FaCheckCircle /> },
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex((step) => step.key === order?.orderStatus);
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

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-500 text-xl">Order not found!</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();
  const nextStatus = getNextStatus(order.orderStatus);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">
              Order Tracking
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                order.orderStatus === "Delivered"
                  ? "bg-green-100 text-green-600"
                  : order.orderStatus === "Cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
          <p className="text-gray-500 text-sm">Order ID: #{order._id}</p>
          <p className="text-gray-500 text-sm">
            Estimated Time: {order.estimatedDeliveryTime}
          </p>
        </div>

        {/* ✅ Admin Only — Simulate Delivery Button */}
        {user?.role === "admin" &&
          order.orderStatus !== "Delivered" &&
          order.orderStatus !== "Cancelled" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-600 font-semibold text-sm mb-3">
                🔧 Admin Controls — Simulate Delivery
              </p>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">
                    Current:{" "}
                    <span className="font-bold text-orange-500">
                      {order.orderStatus}
                    </span>
                  </p>
                  {nextStatus && (
                    <p className="text-gray-500 text-sm">
                      Next:{" "}
                      <span className="font-bold text-blue-500">
                        {nextStatus}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  onClick={handleSimulateDelivery}
                  disabled={simulating || !nextStatus}
                  className="bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 flex items-center space-x-2"
                >
                  {simulating ? (
                    <>
                      <div className="spinner !w-4 !h-4 !border-2"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <FaMotorcycle />
                      <span>Move to {nextStatus}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        {/* Order Delivered Message */}
        {order.orderStatus === "Delivered" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-green-600 font-bold text-xl">
              🎉 Order Delivered Successfully!
            </p>
            <p className="text-green-500 text-sm mt-1">
              Thank you for ordering from QuickBite!
            </p>
          </div>
        )}

        {/* Order Status Tracker */}
        {order.orderStatus !== "Cancelled" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Order Status
            </h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div
                className="absolute left-5 top-0 w-0.5 bg-primary-500 transition-all duration-500"
                style={{
                  height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                }}
              ></div>

              {/* Steps */}
              <div className="space-y-6">
                {statusSteps.map((step, index) => (
                  <div key={step.key} className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                        index <= currentStepIndex
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          index <= currentStepIndex
                            ? "text-primary-500"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      {index === currentStepIndex && (
                        <p className="text-gray-400 text-sm">In progress...</p>
                      )}
                      {index < currentStepIndex && (
                        <p className="text-gray-400 text-sm">Completed ✓</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cancelled Message */}
        {order.orderStatus === "Cancelled" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <p className="text-red-600 font-semibold text-lg">
              ❌ Order Cancelled
            </p>
            <p className="text-red-400 text-sm mt-1">
              Your order has been cancelled.
            </p>
          </div>
        )}

        {/* Delivery Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <MdLocationOn className="text-primary-500 text-xl" />
            <h2 className="text-lg font-bold text-gray-800">
              Delivery Address
            </h2>
          </div>
          <p className="text-gray-600">
            {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
            {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Order Items
          </h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/50?text=Food"
                    }
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                </div>
                <span className="font-semibold">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Items Total</span>
              <span>₹{order.itemsTotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span>
              <span>₹{order.deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-lg">
              <span>Total Paid</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Link
          to="/orders"
          className="block text-center bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition"
        >
          View All Orders
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default OrderTracking;
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { clearCart } from "../redux/slices/cartSlice";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurantId, restaurantName } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);

  // Calculate totals
  const itemsTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryCharge = 40;
  const totalAmount = itemsTotal + deliveryCharge;

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    // Validate address
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill in all address fields!");
      return;
    }

    setLoading(true);
    try {
      // Step 1 — Create order in our database
      const orderData = {
        restaurantId,
        items: items.map((item) => ({
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        deliveryAddress: address,
        paymentMethod: "Razorpay",
      };

      const { data: orderRes } = await axiosInstance.post("/orders", orderData);

      if (!orderRes.success) {
        toast.error("Failed to create order!");
        return;
      }

      const orderId = orderRes.data._id;

      // Step 2 — Create Razorpay payment order
      const { data: paymentRes } = await axiosInstance.post(
        "/payment/create-order",
        { orderId }
      );

      if (!paymentRes.success) {
        toast.error("Failed to initialize payment!");
        return;
      }

      // Step 3 — Open Razorpay payment popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentRes.data.amount,
        currency: paymentRes.data.currency,
        name: "QuickBite",
        description: `Order from ${restaurantName}`,
        order_id: paymentRes.data.razorpayOrderId,
        // Enable all payment methods including UPI
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [
                  { method: "upi" },
                ],
              },
              other: {
                name: "Other Payment Methods",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.upi", "block.other"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        handler: async function (response) {
          try {
            // Step 4 — Verify payment
            const { data: verifyRes } = await axiosInstance.post(
              "/payment/verify",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId,
              }
            );

            if (verifyRes.success) {
              // Step 5 — Clear cart and redirect to order tracking
              dispatch(clearCart());
              toast.success("Payment successful! Order placed! 🎉");
              navigate(`/order/${orderId}`);
            }
          } catch (error) {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled!");
            setLoading(false);
          },
        },
      };

      // Load Razorpay script and open popup
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FaMapMarkerAlt className="text-primary-500 text-xl" />
              <h2 className="text-lg font-bold text-gray-800">
                Delivery Address
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  placeholder="House no, Street, Area"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Order Summary
            </h2>

            {/* Restaurant */}
            <p className="text-gray-500 text-sm mb-4">
              From:{" "}
              <span className="font-semibold text-primary-500">
                {restaurantName}
              </span>
            </p>

            {/* Items */}
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-gray-600 text-sm"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Items Total</span>
                <span>₹{itemsTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Test Mode Info */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mt-4">
              <p className="text-orange-600 text-xs font-semibold mb-1">
                🧪 Test Mode — Use these credentials:
              </p>
              <p className="text-orange-500 text-xs">UPI: success@razorpay</p>
              <p className="text-orange-500 text-xs">Card: 4111 1111 1111 1111</p>
              <p className="text-orange-500 text-xs">Expiry: 12/28 | CVV: 123 | OTP: 1234</p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition mt-4 disabled:opacity-50"
            >
              {loading ? "Processing..." : `Pay ₹${totalAmount}`}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
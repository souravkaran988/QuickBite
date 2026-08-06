import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { MdShoppingCart } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addToCart, removeFromCart, clearCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurantName, restaurantId } = useSelector((state) => state.cart);

  // Calculate totals
  const itemsTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryCharge = itemsTotal > 0 ? 40 : 0;
  const totalAmount = itemsTotal + deliveryCharge;

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared!");
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <MdShoppingCart className="text-gray-300 text-9xl mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Your cart is empty!
          </h2>
          <p className="text-gray-500 mb-6">
            Add items from a restaurant to get started.
          </p>
          <Link
            to="/"
            className="bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition"
          >
            Browse Restaurants
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
          <button
            onClick={handleClearCart}
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition"
          >
            <FaTrash />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Restaurant Name */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-gray-600">
            Ordering from:{" "}
            <span className="font-bold text-primary-500">{restaurantName}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4"
              >
                {/* Item Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image || "https://via.placeholder.com/100?text=Food"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-primary-500 font-bold">₹{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="bg-primary-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <span className="font-bold text-gray-800 w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      dispatch(
                        addToCart({
                          item,
                          restaurantId,
                          restaurantName,
                        })
                      )
                    }
                    className="bg-primary-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>

                {/* Item Total */}
                <p className="font-bold text-gray-800 w-16 text-right">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Items Total</span>
                  <span>₹{itemsTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>₹{deliveryCharge}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center text-primary-500 mt-3 hover:underline"
              >
                Add more items
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
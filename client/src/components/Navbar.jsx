import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
import { useState } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  // Calculate total items in cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MdRestaurant className="text-primary-500 text-3xl" />
            <span className="text-2xl font-bold text-primary-500">
              QuickBite
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-500 font-medium transition"
            >
              Home
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                className="text-gray-600 hover:text-primary-500 font-medium transition"
              >
                My Orders
              </Link>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-600 hover:text-primary-500 font-medium transition"
              >
                Admin
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-gray-600 hover:text-primary-500 text-xl transition" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 font-medium">
                  Hi, {user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-primary-500 font-medium hover:text-primary-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-gray-600 text-xl" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <FaTimes className="text-gray-600 text-xl" />
              ) : (
                <FaBars className="text-gray-600 text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-600 hover:text-primary-500 font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className="block text-gray-600 hover:text-primary-500 font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </Link>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin"
                className="block text-gray-600 hover:text-primary-500 font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 font-medium py-2"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block text-primary-500 font-medium py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-primary-500 text-white px-4 py-2 rounded-lg text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
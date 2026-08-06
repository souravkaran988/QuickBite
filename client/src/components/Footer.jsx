import { Link } from "react-router-dom";
import { MdRestaurant } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <MdRestaurant className="text-primary-500 text-3xl" />
              <span className="text-2xl font-bold text-primary-500">
                QuickBite
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Order food from the best restaurants in your city. Fast delivery,
              great taste!
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
               <a href="https://www.facebook.com/profile.php?id=61555314655591" target="_blank" rel="noopener noreferrer">
               <FaFacebook className="text-gray-400 hover:text-primary-500 text-xl cursor-pointer transition" />
               </a>
               <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
               <FaTwitter className="text-gray-400 hover:text-primary-500 text-xl cursor-pointer transition" />
               </a>
               <a href="https://www.instagram.com/souravkaran988/?hl=en" target="_blank" rel="noopener noreferrer">
               <FaInstagram className="text-gray-400 hover:text-primary-500 text-xl cursor-pointer transition" />
               </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-500 text-sm transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-400 hover:text-primary-500 text-sm transition"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-400 hover:text-primary-500 text-sm transition"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📧 support@quickbite.com</li>
              <li>📞 +91 9883889500</li>
              <li>📍 Kolkata, West Bengal, India</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} QuickBite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
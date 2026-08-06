import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axiosInstance from "../../utils/axios";
import toast from "react-hot-toast";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cuisine: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    deliveryTime: "30-45 mins",
    minimumOrder: 0,
    deliveryCharge: 0,
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await axiosInstance.get("/restaurants");
      if (data.success) setRestaurants(data.data);
    } catch (error) {
      toast.error("Failed to load restaurants!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      cuisine: restaurant.cuisine.join(", "),
      street: restaurant.address.street,
      city: restaurant.address.city,
      state: restaurant.address.state,
      pincode: restaurant.address.pincode,
      phone: restaurant.phone,
      email: restaurant.email,
      deliveryTime: restaurant.deliveryTime,
      minimumOrder: restaurant.minimumOrder,
      deliveryCharge: restaurant.deliveryCharge,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?"))
      return;
    try {
      const { data } = await axiosInstance.delete(`/restaurants/${id}`);
      if (data.success) {
        toast.success("Restaurant deleted!");
        fetchRestaurants();
      }
    } catch (error) {
      toast.error("Failed to delete restaurant!");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const { data } = await axiosInstance.put(
        `/restaurants/${id}/toggle-status`
      );
      if (data.success) {
        toast.success(data.message);
        fetchRestaurants();
      }
    } catch (error) {
      toast.error("Failed to update status!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append(
        "cuisine",
        JSON.stringify(formData.cuisine.split(",").map((c) => c.trim()))
      );
      form.append(
        "address",
        JSON.stringify({
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        })
      );
      form.append("phone", formData.phone);
      form.append("email", formData.email);
      form.append("deliveryTime", formData.deliveryTime);
      form.append("minimumOrder", formData.minimumOrder);
      form.append("deliveryCharge", formData.deliveryCharge);
      if (image) form.append("image", image);

      let data;
      if (editingRestaurant) {
        const res = await axiosInstance.put(
          `/restaurants/${editingRestaurant._id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        data = res.data;
      } else {
        const res = await axiosInstance.post("/restaurants", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        data = res.data;
      }

      if (data.success) {
        toast.success(
          editingRestaurant
            ? "Restaurant updated!"
            : "Restaurant created!"
        );
        setShowForm(false);
        setEditingRestaurant(null);
        setFormData({
          name: "",
          description: "",
          cuisine: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
          phone: "",
          email: "",
          deliveryTime: "30-45 mins",
          minimumOrder: 0,
          deliveryCharge: 0,
        });
        setImage(null);
        fetchRestaurants();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Restaurants
          </h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingRestaurant(null);
            }}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-xl hover:bg-primary-600 transition"
          >
            <FaPlus />
            <span>Add Restaurant</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Restaurant Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Cuisine (comma separated)</label>
                <input
                  type="text"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  placeholder="Indian, Chinese, Italian"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Delivery Time</label>
                <input
                  type="text"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Minimum Order (₹)</label>
                <input
                  type="number"
                  name="minimumOrder"
                  value={formData.minimumOrder}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Delivery Charge (₹)</label>
                <input
                  type="number"
                  name="deliveryCharge"
                  value={formData.deliveryCharge}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Restaurant Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingRestaurant
                    ? "Update Restaurant"
                    : "Add Restaurant"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRestaurant(null);
                  }}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Restaurants List */}
        {restaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No restaurants yet!</p>
            <p className="text-gray-400 mt-2">Add your first restaurant.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={restaurant.image || "https://via.placeholder.com/400x200?text=Restaurant"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {restaurant.cuisine.join(", ")}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(restaurant._id)}
                        className={`text-2xl ${
                          restaurant.isOpen
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      >
                        {restaurant.isOpen ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <span className="text-sm text-gray-500">
                        {restaurant.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/menu/${restaurant._id}`}
                        className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                      >
                        Menu
                      </Link>
                      <button
                        onClick={() => handleEdit(restaurant)}
                        className="bg-orange-100 text-orange-600 p-1.5 rounded-lg hover:bg-orange-200 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant._id)}
                        className="bg-red-100 text-red-600 p-1.5 rounded-lg hover:bg-red-200 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
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

export default AdminRestaurants;
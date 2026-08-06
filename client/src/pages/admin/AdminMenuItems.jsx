import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axiosInstance from "../../utils/axios";
import toast from "react-hot-toast";

const AdminMenuItems = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: true,
    isAvailable: true,
    isBestseller: false,
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const fetchData = async () => {
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        axiosInstance.get(`/restaurants/${restaurantId}`),
        axiosInstance.get(`/menu/${restaurantId}`),
      ]);
      if (restaurantRes.data.success) setRestaurant(restaurantRes.data.data);
      if (menuRes.data.success) setMenuItems(menuRes.data.data);
    } catch (error) {
      toast.error("Failed to load data!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      isBestseller: item.isBestseller,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const { data } = await axiosInstance.delete(`/menu/${id}`);
      if (data.success) {
        toast.success("Menu item deleted!");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete item!");
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/menu/${id}/toggle-availability`);
      if (data.success) {
        toast.success(data.message);
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update availability!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("restaurant", restaurantId);
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("category", formData.category);
      form.append("isVeg", formData.isVeg);
      form.append("isAvailable", formData.isAvailable);
      form.append("isBestseller", formData.isBestseller);
      if (image) form.append("image", image);

      let data;
      if (editingItem) {
        const res = await axiosInstance.put(`/menu/${editingItem._id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        data = res.data;
      } else {
        const res = await axiosInstance.post("/menu", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        data = res.data;
      }

      if (data.success) {
        toast.success(editingItem ? "Item updated!" : "Item added!");
        setShowForm(false);
        setEditingItem(null);
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          isVeg: true,
          isAvailable: true,
          isBestseller: false,
        });
        setImage(null);
        fetchData();
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/restaurants"
              className="text-gray-500 hover:text-primary-500 transition"
            >
              <MdArrowBack className="text-2xl" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              {restaurant?.name} — Menu
            </h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingItem(null);
            }}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-xl hover:bg-primary-600 transition"
          >
            <FaPlus />
            <span>Add Item</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-gray-600 text-sm mb-1">Item Name</label>
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
                <label className="block text-gray-600 text-sm mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Starter, Main Course, Dessert"
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
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Item Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={formData.isVeg}
                    onChange={handleChange}
                    className="w-4 h-4 accent-green-500"
                  />
                  <span className="text-gray-600 text-sm">Vegetarian</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary-500"
                  />
                  <span className="text-gray-600 text-sm">Available</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isBestseller"
                    checked={formData.isBestseller}
                    onChange={handleChange}
                    className="w-4 h-4 accent-yellow-500"
                  />
                  <span className="text-gray-600 text-sm">Bestseller</span>
                </label>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingItem
                    ? "Update Item"
                    : "Add Item"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Menu Items List */}
        {menuItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No menu items yet!</p>
            <p className="text-gray-400 mt-2">Add your first menu item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex space-x-4"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image || "https://via.placeholder.com/100?text=Food"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-primary-500 font-bold">₹{item.price}</p>
                      <p className="text-gray-400 text-xs">{item.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleAvailability(item._id)}
                        className={`text-xl ${
                          item.isAvailable ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        {item.isAvailable ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-orange-100 text-orange-600 p-1.5 rounded-lg hover:bg-orange-200 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-100 text-red-600 p-1.5 rounded-lg hover:bg-red-200 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span
                      className={`w-3 h-3 border flex items-center justify-center ${
                        item.isVeg ? "border-green-500" : "border-red-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.isVeg ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.isVeg ? "Veg" : "Non-veg"}
                    </span>
                    {item.isBestseller && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        Bestseller
                      </span>
                    )}
                    {!item.isAvailable && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Unavailable
                      </span>
                    )}
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

export default AdminMenuItems;
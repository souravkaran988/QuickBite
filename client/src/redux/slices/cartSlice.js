import { createSlice } from "@reduxjs/toolkit";

// Get cart from localStorage if it exists
const cartFromStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { items: [], restaurantId: null, restaurantName: "" };

const initialState = {
  items: cartFromStorage.items,
  restaurantId: cartFromStorage.restaurantId,
  restaurantName: cartFromStorage.restaurantName,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const { item, restaurantId, restaurantName } = action.payload;

      // If cart has items from different restaurant → clear cart first
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
        state.restaurantId = restaurantId;
        state.restaurantName = restaurantName;
      }

      // Set restaurant info
      if (!state.restaurantId) {
        state.restaurantId = restaurantId;
        state.restaurantName = restaurantName;
      }

      // Check if item already exists in cart
      const existingItem = state.items.find((i) => i._id === item._id);

      if (existingItem) {
        // Item exists → increase quantity
        existingItem.quantity += 1;
      } else {
        // Item does not exist → add to cart with quantity 1
        state.items.push({ ...item, quantity: 1 });
      }

      // Save to localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: state.items,
          restaurantId: state.restaurantId,
          restaurantName: state.restaurantName,
        })
      );
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find((i) => i._id === itemId);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          // Decrease quantity
          existingItem.quantity -= 1;
        } else {
          // Remove item completely
          state.items = state.items.filter((i) => i._id !== itemId);
        }
      }

      // If cart is empty → reset restaurant info
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = "";
      }

      // Save to localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: state.items,
          restaurantId: state.restaurantId,
          restaurantName: state.restaurantName,
        })
      );
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = "";
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
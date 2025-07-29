import { createSlice } from "@reduxjs/toolkit";

// Initial Redux state for Amazon-like e-commerce features
const initialState = {
  products: [], // Items currently in the shopping cart
  userInfo: null, // Authenticated user details
  isAuthenticated: false, // Flag for user authentication status
  buyNowProduct: null, // Single product for 'Buy Now' flow
  orders: [], // Array of completed orders
  cancelOrders: [], // Array of canceled orders
  returnOrders: [], // Array of returned orders
};

/**
 * amazonSlice
 * Defines Redux state slice containing cart, user, and order reducers
 */
export const amazonSlice = createSlice({
  name: "amazon",
  initialState,
  reducers: {
    /**
     * addToCart
     * Adds item to cart or increments quantity if already exists
     */
    addToCart: (state, action) => {
      const product = state.products.find(
        (p) => p.title === action.payload.title
      );
      if (product) {
        product.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },

    /**
     * deleteProduct
     * Removes product from cart by title match
     */
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.title !== action.payload
      );
    },

    /**
     * resetCart
     * Clears all items from the cart
     */
    resetCart: (state) => {
      state.products = [];
    },

    /**
     * increaseQuantity
     * Increments quantity of specified cart item
     */
    increaseQuantity: (state, action) => {
      const product = state.products.find((p) => p.title === action.payload);
      if (product) product.quantity++;
    },

    /**
     * decreaseQuantity
     * Decrements quantity of specified cart item, minimum 1
     */
    decreaseQuantity: (state, action) => {
      const product = state.products.find((p) => p.title === action.payload);
      if (product) {
        product.quantity = Math.max(1, product.quantity - 1);
      }
    },

    /**
     * setUserInfo
     * Stores authenticated user information in state
     */
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },

    /**
     * userSignOut
     * Clears userInfo on sign out
     */
    userSignOut: (state) => {
      state.userInfo = null;
    },

    /**
     * setUserAuthentication
     * Flags user authentication status (true/false)
     */
    setUserAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    /**
     * buyNow
     * Stores a single product for immediate purchase flow
     */
    buyNow: (state, action) => {
      state.buyNowProduct = action.payload;
    },

    /**
     * resetBuyNowProduct
     * Clears the buyNowProduct after checkout
     */
    resetBuyNowProduct: (state) => {
      state.buyNowProduct = null;
    },

    /**
     * addToOrders
     * Populates list of completed orders
     */
    addToOrders: (state, action) => {
      state.orders = action.payload;
    },

    /**
     * resetOrders
     * Clears all completed orders from state
     */
    resetOrders: (state) => {
      state.orders = [];
    },

    /**
     * addTocancelOrders
     * Sets list of canceled orders
     */
    addTocancelOrders: (state, action) => {
      state.cancelOrders = action.payload;
    },

    /**
     * resetCancelOrders
     * Clears canceled orders array
     */
    resetCancelOrders: (state) => {
      state.cancelOrders = [];
    },

    /**
     * addToreturnOrders
     * Sets list of returned orders
     */
    addToreturnOrders: (state, action) => {
      state.returnOrders = action.payload;
    },

    /**
     * resetReturnOrders
     * Clears returned orders array
     */
    resetReturnOrders: (state) => {
      state.returnOrders = [];
    },
  },
});

// Export action creators and reducer
export const {
  addToCart,
  deleteProduct,
  resetCart,
  decreaseQuantity,
  increaseQuantity,
  setUserInfo,
  userSignOut,
  setUserAuthentication,
  buyNow,
  resetBuyNowProduct,
  addToOrders,
  resetOrders,
  addTocancelOrders,
  resetCancelOrders,
  addToreturnOrders,
  resetReturnOrders,
} = amazonSlice.actions;

export default amazonSlice.reducer;

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  userInfo: null,
  isAuthenticated: false,
  buyNowProduct: null,
  orders: [],
  cancelOrders: [],
  returnOrders: [],
};

export const amazonSlice = createSlice({
  name: 'amazon',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = state.products.find((product) => product.title === action.payload.title);
      if (product) {
        product.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter((product) => product.title !== action.payload);
    },
    resetCart: (state) => {
      state.products = [];
    },
    increaseQuantity: (state, action) => {
      const product = state.products.find(product => product.title === action.payload);
      product.quantity++;
    },
    decreaseQuantity: (state, action) => {
      const product = state.products.find((product) => product.title === action.payload);
      if (product.quantity === 1) {
        product.quantity = 1;
      } else {
        product.quantity--;
      }
    },

    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    userSignOut: (state) => {
      state.userInfo = null;
    },

    setUserAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    buyNow: (state, action) => {
      state.buyNowProduct = action.payload;
    },
    resetBuyNowProduct: (state) => {
      state.buyNowProduct = null;
    },

    addToOrders: (state, action) => {
      state.orders = action.payload;
    },
    resetOrders: (state) => {
      state.orders = [];
    },

    addTocancelOrders: (state, action) => {
      state.cancelOrders = action.payload;
    },

    resetCancelOrders: (state) => {
      state.cancelOrders = [];
    },


    addToreturnOrders: (state, action) => {
      state.returnOrders = action.payload;
    },

    resetReturnOrders: (state) => {
      state.returnOrders = [];
    },

  },
})

export const { addToCart, deleteProduct, resetCart, decreaseQuantity, increaseQuantity, setUserInfo, userSignOut, setUserAuthentication, buyNow, resetBuyNowProduct, addToOrders, cancelOrder, resetOrders, addToreturnOrders, addTocancelOrders, resetCancelOrders, resetReturnOrders } = amazonSlice.actions;

export default amazonSlice.reducer;
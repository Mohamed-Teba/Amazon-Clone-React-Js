// Import React library for component development
import React from "react";
// Import useSelector hook for accessing Redux store state
import { useSelector } from "react-redux";
// Import ScrollRestoration for maintaining scroll position
import { ScrollRestoration } from "react-router-dom";
// Import EmptyCart component for when cart is empty
import EmptyCart from "./emptyCart";
// Import CartItems component for displaying cart items
import CartItems from "./cartItems";
// Import useCart hook for cart state management
import { useCart } from "../../context/userCartContext";

// Cart component - Main cart page that displays cart items or empty cart state
const Cart = () => {
  // Get products from Redux store (local cart)
  const products = useSelector((state) => state.amazon.products);
  // Get user cart from context (persisted cart)
  const { userCart } = useCart();

  // Return the cart page layout
  return (
    <div className="gap-5 w-full h-full bg-gray-200 ">
      {/* Scroll restoration component for navigation */}
      <ScrollRestoration />
      {/* Conditional rendering based on cart state */}
      {
        // Show cart items if there are products in either local or user cart
        products.length > 0 || userCart.length > 0 ? (
          <CartItems /> // Display cart items component
        ) : (
          <EmptyCart />
        ) // Display empty cart component
      }
    </div>
  );
};

// Export the Cart component as the default export
export default Cart;

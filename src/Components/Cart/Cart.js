// Importing React core library
import React from "react";

// Importing Redux hook to access the store state
import { useSelector } from "react-redux";

// Importing scroll restoration component from React Router to maintain scroll position
import { ScrollRestoration } from "react-router-dom";

// Importing component that shows when cart is empty
import EmptyCart from "./emptyCart";

// Importing component that displays items in the cart
import CartItems from "./cartItems";

// Importing custom context to access user's cart (possibly from Firebase or local state)
import { useCart } from "../../context/userCartContext";

const Cart = () => {
  // Accessing the products stored in the Redux store (e.g., added to cart)
  const products = useSelector((state) => state.amazon.products);

  // Accessing the user's cart from the custom context provider
  const { userCart } = useCart();

  return (
    // Wrapper div for the cart page layout
    <div className="gap-5 w-full h-full bg-gray-200 ">
      {/* Automatically restores scroll position when navigating */}
      <ScrollRestoration />

      {/* Conditional rendering:
                - If there are products in Redux store or in userCart context
                - Show CartItems component
                - Otherwise, show EmptyCart component */}
      {products.length > 0 || userCart.length > 0 ? (
        <CartItems />
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

// Exporting the Cart component as default
export default Cart;

// Import React hooks for context creation and state management
import React, { createContext, useContext, useState, useEffect } from "react";
// Import Firestore functions for database operations
import { collection, doc, getDoc } from "firebase/firestore";
// Import Firebase database configuration
import { db } from "../firebase.config";
// Import Redux useSelector hook for accessing store state
import { useSelector } from "react-redux";

// Create context for user cart state management
const UserCartContext = createContext();

// UserCartProvider component - Provides cart state and functions to child components
export const UserCartProvider = ({ children }) => {
  // State for storing user's cart items
  const [userCart, setUserCart] = useState([]);
  // Get user info and authentication status from Redux store
  const userInfo = useSelector((state) => state.amazon.userInfo);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);

  // Effect to fetch user cart from Firebase when user is authenticated
  useEffect(() => {
    if (authenticated && userInfo) {
      // Function to fetch user cart data from Firebase
      const getUserCartFromFirebase = async (userInfo) => {
        try {
          // Reference to user's cart document in Firebase
          const userCartRef = doc(
            collection(db, "users", userInfo.email, "cart"),
            userInfo.id
          );
          const docSnapshot = await getDoc(userCartRef);
          if (docSnapshot.exists()) {
            // Set cart data from Firebase
            setUserCart(docSnapshot.data().cart);
          }
        } catch (error) {
          console.error("Error fetching user cart data:", error);
        }
      };
      getUserCartFromFirebase(userInfo);
    } else {
      // Clear cart when user is not authenticated
      setUserCart([]);
    }
  }, [authenticated, userInfo]);

  // Function to update user cart state
  const updateUserCart = (updatedCart) => {
    setUserCart(updatedCart);
  };

  // State for cart totals
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);

  // Effect to calculate cart totals when cart items change
  useEffect(() => {
    let allPrice = 0;
    let allQty = 0;
    if (userCart.length > 0 && authenticated) {
      // Calculate total price and quantity from cart items
      userCart.forEach((product) => {
        allPrice += product.quantity * product.price;
        allQty += product.quantity;
      });
      setCartTotalPrice(allPrice);
      setCartTotalQty(allQty);
    } else {
      // Reset totals when cart is empty or user not authenticated
      setCartTotalQty(0);
      setCartTotalPrice(0);
    }
  }, [userCart, authenticated]);

  // Provide cart state and functions to child components
  return (
    <UserCartContext.Provider
      value={{ userCart, updateUserCart, cartTotalQty, cartTotalPrice }}
    >
      {children}
    </UserCartContext.Provider>
  );
};

// Custom hook to use cart context in components
export const useCart = () => {
  return useContext(UserCartContext);
};

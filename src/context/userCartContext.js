import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useSelector } from "react-redux";

// Create a context to hold and share user cart data
const UserCartContext = createContext();

/**
 * UserCartProvider
 * Provides user cart data and derived totals to descendant components.
 * Fetches cart from Firestore when user is authenticated,
 * calculates total quantity and price, and allows updates.
 */
export const UserCartProvider = ({ children }) => {
  // State to store cart items fetched from Firestore
  const [userCart, setUserCart] = useState([]);

  // Get authenticated user info from Redux store
  const userInfo = useSelector((state) => state.amazon.userInfo);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);

  /**
   * useEffect: Fetch user cart from Firestore when authentication changes
   */
  useEffect(() => {
    if (authenticated && userInfo) {
      const getUserCartFromFirebase = async (userInfo) => {
        try {
          // Reference to user's cart document in Firestore
          const userCartRef = doc(
            collection(db, "users", userInfo.email, "cart"),
            userInfo.id
          );
          const docSnapshot = await getDoc(userCartRef);

          // If document exists, update userCart state
          if (docSnapshot.exists()) {
            setUserCart(docSnapshot.data().cart);
          }
        } catch (error) {
          console.error("Error fetching user cart data:", error);
        }
      };
      getUserCartFromFirebase(userInfo);
    } else {
      // Clear cart for unauthenticated users
      setUserCart([]);
    }
  }, [authenticated, userInfo]);

  /**
   * updateUserCart
   * Allows components to manually update the cart state (e.g., after adding/removing items)
   * @param {Array} updatedCart - new cart array to set
   */
  const updateUserCart = (updatedCart) => {
    setUserCart(updatedCart);
  };

  // State for total quantity and price calculated from userCart
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);

  /**
   * useEffect: Recalculate totals whenever cart contents or authentication change
   */
  useEffect(() => {
    let allPrice = 0;
    let allQty = 0;

    if (authenticated && userCart.length > 0) {
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

  return (
    <UserCartContext.Provider
      value={{ userCart, updateUserCart, cartTotalQty, cartTotalPrice }}
    >
      {children}
    </UserCartContext.Provider>
  );
};

/**
 * useCart
 * Custom hook to access cart context values in components
 */
export const useCart = () => {
  return useContext(UserCartContext);
};

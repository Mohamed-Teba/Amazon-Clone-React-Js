import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useSelector } from "react-redux";

// Create context for sharing user orders throughout the app
const UserOrdersContext = createContext();

/**
 * UserOrdersProvider
 * Wraps application components to provide:
 * - userOrders: array of past orders fetched from Firestore
 * - updateUserOrders: function to manually update orders state
 */
export const UserOrdersProvider = ({ children }) => {
  // State to store list of user orders
  const [userOrders, setUserOrders] = useState([]);

  // Retrieve authentication and user info from Redux store
  const userInfo = useSelector((state) => state.amazon.userInfo);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);

  /**
   * useEffect: Fetch user orders when authentication state or userInfo changes
   */
  useEffect(() => {
    if (authenticated && userInfo) {
      const getUserOrdersFromFirebase = async (userInfo) => {
        try {
          // Reference to the user's orders document in Firestore
          const userOrdersRef = doc(
            collection(db, "users", userInfo.email, "orders"),
            userInfo.id
          );
          const docSnapshot = await getDoc(userOrdersRef);

          // Update state with orders data if document exists, otherwise reset to empty
          if (docSnapshot.exists()) {
            setUserOrders(docSnapshot.data().orders);
          } else {
            setUserOrders([]);
          }
        } catch (error) {
          console.error("Error fetching user orders data:", error);
        }
      };
      getUserOrdersFromFirebase(userInfo);
    } else {
      // Clear orders array if user is not authenticated
      setUserOrders([]);
    }
  }, [authenticated, userInfo]);

  /**
   * updateUserOrders
   * Allows components to manually update the orders state
   */
  const updateUserOrders = (updatedOrders) => {
    setUserOrders(updatedOrders);
  };

  // Provide context values to child components
  return (
    <UserOrdersContext.Provider value={{ userOrders, updateUserOrders }}>
      {children}
    </UserOrdersContext.Provider>
  );
};

/**
 * useOrders
 * Custom hook to access userOrders context easily in other components
 */
export const useOrders = () => {
  return useContext(UserOrdersContext);
};

import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useSelector } from "react-redux";

// Create context for user address management
const UserAddressContext = createContext();

/**
 * UserAddressProvider
 * Wraps application and provides user address data, selected address,
 * and payment method state to child components via context.
 */
export const UserAddressProvider = ({ children }) => {
  // State to store list of user addresses from Firestore
  const [userAddress, setUserAddress] = useState([]);

  // Get authentication status and user info from Redux store
  const userInfo = useSelector((state) => state.amazon.userInfo);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);

  /**
   * updateUserAddress
   * Allows components to update userAddress state manually
   */
  const updateUserAddress = (updatedAddress) => {
    setUserAddress(updatedAddress);
  };

  /**
   * Fetch user shipping addresses from Firestore when authenticated
   * on change of authenticated or userInfo.
   */
  useEffect(() => {
    if (authenticated && userInfo) {
      const getuserAddressesFromFirebase = async (userInfo) => {
        try {
          // Reference to the user's addresses document
          const userAddressesRef = doc(
            collection(db, "users", userInfo.email, "shippingAddresses"),
            userInfo.id
          );

          const docSnapshot = await getDoc(userAddressesRef);

          // If document exists, update userAddress state
          if (docSnapshot.exists()) {
            setUserAddress(docSnapshot.data().Addresses);
          }
        } catch (error) {
          console.error("Error fetching user address data:", error);
        }
      };
      getuserAddressesFromFirebase(userInfo);
    } else {
      // Clear addresses if not authenticated
      setUserAddress([]);
    }
  }, [authenticated, userInfo]);

  // State for currently selected shipping address
  const [selectedAddress, setSelectedAddress] = useState(null);

  /**
   * updateSelectedAddress
   * Allows components to change selected shipping address
   */
  const updateSelectedAddress = (updatedSelectedAddress) => {
    setSelectedAddress(updatedSelectedAddress);
  };

  // State for selected payment method (e.g., card, COD)
  const [selectedPayment, setSelectedPayment] = useState("");

  /**
   * updateSelectedPayment
   * Allows components to set the payment method for checkout
   */
  const updateSelectedPayment = (updatedSelectedPayment) => {
    setSelectedPayment(updatedSelectedPayment);
  };

  // Provide address and payment context to descendants
  return (
    <UserAddressContext.Provider
      value={{
        userAddress,
        updateUserAddress,
        selectedAddress,
        updateSelectedAddress,
        selectedPayment,
        updateSelectedPayment,
      }}
    >
      {children}
    </UserAddressContext.Provider>
  );
};

/**
 * useAddress
 * Custom hook to access UserAddressContext values in components
 */
export const useAddress = () => {
  return useContext(UserAddressContext);
};

import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useSelector } from "react-redux";

const UserAddressContext = createContext();

export const UserAddressProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState([]);

  const userInfo = useSelector((state) => state.amazon.userInfo);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);

  const updateUserAddress = (updatedAddress) => {
    setUserAddress(updatedAddress);
  };

  useEffect(() => {
    // Get user's saved shipping addresses from Firestore
    if (authenticated && userInfo && userInfo.email && userInfo.id) {
      const getuserAddressesFromFirebase = async () => {
        try {
          // Reference to user’s shipping address document
          const userAddressesRef = doc(
            collection(db, "users", userInfo.email, "shippingAddresses"),
            userInfo.id
          );

          // Attempt to get the document snapshot
          const docSnapshot = await getDoc(userAddressesRef);

          // If document exists, update state with addresses
          if (docSnapshot.exists()) {
            setUserAddress(docSnapshot.data().Addresses);
          }
        } catch (error) {
          console.error(
            "Error fetching user address data:",
            error.code,
            error.message
          );
        }
      };

      getuserAddressesFromFirebase();
    } else {
      // Clear address state if user is not authenticated
      setUserAddress([]);
    }
  }, [authenticated, userInfo]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const updateSelectedAddress = (updatedSelectedAddress) => {
    setSelectedAddress(updatedSelectedAddress);
  };

  const [selectedPayment, setSelectedPayment] = useState("");
  const updateSelectedPayment = (updatedSelectedPayment) => {
    setSelectedPayment(updatedSelectedPayment);
  };

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

export const useAddress = () => {
  return useContext(UserAddressContext);
};

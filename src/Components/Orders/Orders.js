// Import React hooks for state management and side effects
import React, { useEffect, useState } from "react";
// Import Redux hooks for state management
import { useSelector, useDispatch } from "react-redux";
// Import React Router hook for navigation
import { useNavigate } from "react-router-dom";
// Import orders context hook for order management
import { useOrders } from "../../context/userOrderContext";
// Import Redux actions for order management
import {
  addToOrders,
  addTocancelOrders,
  addToreturnOrders,
} from "../../Redux/amazonSlice";
// Import Firestore functions for database operations
import { collection, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
// Import Firebase database configuration
import { db } from "../../firebase.config";
// Import OrderDetails component for displaying order information
import OrderDetails from "./orderDetails";

// Orders component - Main orders page for viewing and managing user orders
const Orders = () => {
  // Redux dispatch function for state updates
  const dispatch = useDispatch();
  // Get user orders and update function from context
  const { userOrders, updateUserOrders } = useOrders();
  // Get orders, cancelled orders, and returned orders from Redux store
  const orders = useSelector((state) => state.amazon.orders);
  const cancelOrders = useSelector((state) => state.amazon.cancelOrders);
  const returnOrders = useSelector((state) => state.amazon.returnOrders);
  // Get authentication status and user info from Redux store
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);
  const userInfo = useSelector((state) => state.amazon.userInfo);

  // Reverse order arrays to show newest orders first
  const reversedOrders = [...orders].reverse();
  const reversedCancelOrders = [...cancelOrders].reverse();
  const reversedReturnOrders = [...returnOrders].reverse();

  // State for controlling which order type to display
  const [showOrders, setShowOrders] = useState(true);
  const [showCancelOrders, setShowCancelOrders] = useState(false);
  const [showReturnOrders, setShowReturnOrders] = useState(false);

  // Navigation function
  const navigate = useNavigate();

  // Effect to redirect to login if user is not authenticated
  useEffect(() => {
    if (!authenticated) {
      navigate("/Login");
    }
  }, [authenticated, navigate]);

  // Helper: Avoid Firestore calls when offline
  const isOnline = () => typeof navigator !== "undefined" && navigator.onLine;

  // Fetch user orders from Firebase
  const fetchOrdersFromFirebase = async (user) => {
    if (!isOnline()) return; // Skip if offline
    try {
      const orderRef = doc(
        collection(db, "users", user.email, "orders"),
        user.id
      );
      const docSnapshot = await getDoc(orderRef);
      const ordersFromFirebase = docSnapshot.exists()
        ? docSnapshot.data().orders
        : [];
      updateUserOrders(ordersFromFirebase);
      dispatch(addToOrders(ordersFromFirebase));
    } catch (error) {
      console.error("Error fetching orders from Firebase:", error);
    }
  };

  // Fetch cancelled orders from Firebase
  const fetchCancelOrdersFromFirebase = async (user) => {
    if (!isOnline()) return; // Skip if offline
    try {
      const cancelRef = doc(
        collection(db, "users", user.email, "cancelOrders"),
        user.id
      );
      const docSnapshot = await getDoc(cancelRef);
      const cancelledOrders = docSnapshot.exists()
        ? docSnapshot.data().cancelOrders
        : [];
      dispatch(addTocancelOrders(cancelledOrders));
    } catch (error) {
      console.error("Error fetching cancelled orders from Firebase:", error);
    }
  };

  // Fetch returned orders from Firebase
  const fetchReturnedOrdersFromFirebase = async (user) => {
    if (!isOnline()) return; // Skip if offline
    try {
      const returnRef = doc(
        collection(db, "users", user.email, "returnOrders"),
        user.id
      );
      const docSnapshot = await getDoc(returnRef);
      const returnedOrders = docSnapshot.exists()
        ? docSnapshot.data().returnOrders
        : [];
      dispatch(addToreturnOrders(returnedOrders));
    } catch (error) {
      console.error("Error fetching returned orders from Firebase:", error);
    }
  };

  // Initialize data fetch when component mounts and dependencies are ready
  useEffect(() => {
    if (authenticated && userInfo?.email) {
      fetchOrdersFromFirebase(userInfo);
      fetchCancelOrdersFromFirebase(userInfo);
      fetchReturnedOrdersFromFirebase(userInfo);
    }
  }, [authenticated, userInfo]);

  // Handle cancelling an order
  const handleCancelOrder = async (item) => {
    if (!isOnline()) return; // Skip if offline
    try {
      // Reference to user's cancelled orders in Firebase
      const userCancelOrdersRef = doc(
        collection(db, "users", userInfo.email, "cancelOrders"),
        userInfo.id
      );
      // Get existing cancelled orders
      const snapshot = await getDoc(userCancelOrdersRef);
      const data = snapshot.exists() ? snapshot.data().cancelOrders : [];
      // Update or create document
      const newCancelList = [...data, item];
      await (snapshot.exists()
        ? updateDoc(userCancelOrdersRef, { cancelOrders: newCancelList })
        : setDoc(userCancelOrdersRef, { cancelOrders: newCancelList }));
      dispatch(addTocancelOrders(newCancelList));
      // Also update active orders
      handleUpdateOrder(item);
    } catch (error) {
      console.error("Error saving cancelled order to Firebase:", error);
    }
  };

  // Handle returning an order
  const handleReturnOrder = async (item) => {
    if (!isOnline()) return; // Skip if offline
    try {
      // Reference to user's returned orders in Firebase
      const userReturnOrdersRef = doc(
        collection(db, "users", userInfo.email, "returnOrders"),
        userInfo.id
      );
      // Get existing returned orders
      const snapshot = await getDoc(userReturnOrdersRef);
      const data = snapshot.exists() ? snapshot.data().returnOrders : [];
      const newReturnList = [...data, item];
      await (snapshot.exists()
        ? updateDoc(userReturnOrdersRef, { returnOrders: newReturnList })
        : setDoc(userReturnOrdersRef, { returnOrders: newReturnList }));
      dispatch(addToreturnOrders(newReturnList));
      // Also update active orders
      handleUpdateOrder(item);
    } catch (error) {
      console.error("Error saving returned order to Firebase:", error);
    }
  };

  // Handle updating orders after cancellation or return
  const handleUpdateOrder = async (item) => {
    if (!isOnline()) return; // Skip if offline
    try {
      // Reference to user's orders in Firebase
      const userOrdersRef = doc(
        collection(db, "users", userInfo.email, "orders"),
        userInfo.id
      );
      const snapshot = await getDoc(userOrdersRef);
      if (snapshot.exists()) {
        const existingOrders = snapshot.data().orders;
        const updatedOrders = existingOrders.filter(
          (order) => order.uniqueNumber !== item.uniqueNumber
        );
        await updateDoc(userOrdersRef, { orders: updatedOrders });
        // Update local state
        const newLocal = userOrders.filter(
          (order) => order.uniqueNumber !== item.uniqueNumber
        );
        updateUserOrders(newLocal);
        dispatch(addToOrders(newLocal));
      }
    } catch (error) {
      console.error("Error updating orders in Firebase:", error);
    }
  };

  // Return the orders page layout
  return (
    <div className="w-full relative py-6 flex flex-col gap-5 bg-white ">
      {/* Navigation tabs for different order types */}
      <div className="w-full h-10 flex gap-7 pl-[8%] mdl:pl-[15%] text-base mdl:text-2xl">
        {/* Active orders tab */}
        <p
          className={`font-semibold cursor-pointer border-r-2 pr-3 mdl:pr-6 ${
            showOrders ? "text-blue-500" : ""
          }`}
          onClick={() => {
            setShowOrders(true);
            setShowCancelOrders(false);
            setShowReturnOrders(false);
          }}
        >
          Your Orders
        </p>

        {/* Cancelled orders tab */}
        <p
          className={`font-semibold cursor-pointer border-r-2 pr-3 mdl:pr-6 ${
            showCancelOrders ? "text-blue-500" : ""
          }`}
          onClick={() => {
            setShowOrders(false);
            setShowCancelOrders(true);
            setShowReturnOrders(false);
          }}
        >
          Cancelled Orders
        </p>

        {/* Returned orders tab */}
        <p
          className={`font-semibold cursor-pointer ${
            showReturnOrders ? "text-blue-500" : ""
          }`}
          onClick={() => {
            setShowOrders(false);
            setShowCancelOrders(false);
            setShowReturnOrders(true);
          }}
        >
          Returned Orders
        </p>
      </div>

      {/* Conditional rendering of order details based on selected tab */}
      {showOrders && (
        <OrderDetails
          ordersData={reversedOrders}
          handleCancelOrder={handleCancelOrder}
          handleReturnOrder={handleReturnOrder}
        />
      )}
      {showCancelOrders && <OrderDetails ordersData={reversedCancelOrders} />}
      {showReturnOrders && <OrderDetails ordersData={reversedReturnOrders} />}
    </div>
  );
};

// Export the Orders component as the default export
export default Orders;

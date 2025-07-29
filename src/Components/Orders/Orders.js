import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../../context/userOrderContext";
import {
  addToOrders,
  addTocancelOrders,
  addToreturnOrders,
} from "../../Redux/amazonSlice";
import { collection, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import OrderDetails from "./orderDetails";

const Orders = () => {
  // ================ STATE MANAGEMENT ================
  // Initialize Redux dispatch and navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access order context for real-time updates
  const { userOrders, updateUserOrders } = useOrders();

  // Retrieve state from Redux store
  const orders = useSelector((state) => state.amazon.orders);
  const cancelOrders = useSelector((state) => state.amazon.cancelOrders);
  const returnOrders = useSelector((state) => state.amazon.returnOrders);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);
  const userInfo = useSelector((state) => state.amazon.userInfo);

  // Create reversed arrays for chronological display (newest first)
  const reversedOrders = [...orders].reverse();
  const reversedCancelOrders = [...cancelOrders].reverse();
  const reversedReturnOrders = [...returnOrders].reverse();

  // UI state for tab management
  const [showOrders, setShowOrders] = useState(true);
  const [showCancelOrders, setShowCancelOrders] = useState(false);
  const [showReturnOrders, setShowReturnOrders] = useState(false);

  // ================ AUTHENTICATION GUARD ================
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authenticated) {
      navigate("/Login");
    }
  }, [authenticated, navigate]);

  // ================ ORDER OPERATIONS ================
  /**
   * Handles order cancellation:
   * 1. Adds order to Firestore 'cancelOrders' collection
   * 2. Updates Redux state with cancelled order
   * 3. Removes order from active orders
   */
  const handleCancelOrder = async (item) => {
    const userCancelOrdersRef = doc(
      collection(db, "users", userInfo.email, "cancelOrders"),
      userInfo.id
    );

    try {
      const userCancelOrdersSnapshot = await getDoc(userCancelOrdersRef);

      if (userCancelOrdersSnapshot.exists()) {
        // Append to existing cancel orders
        const cancelOrdersData = userCancelOrdersSnapshot.data().cancelOrders;
        cancelOrdersData.push(item);
        await updateDoc(userCancelOrdersRef, {
          cancelOrders: cancelOrdersData,
        });
        dispatch(addTocancelOrders(cancelOrdersData));
      } else {
        // Create new cancel orders collection
        await setDoc(userCancelOrdersRef, { cancelOrders: [item] });
        dispatch(addTocancelOrders([item]));
      }
    } catch (error) {
      console.error("Error saving orders to Firebase:", error);
    }

    // Remove from active orders
    handleUpdateOrder(item);
  };

  /**
   * Handles order returns:
   * 1. Adds order to Firestore 'returnOrders' collection
   * 2. Updates Redux state with returned order
   * 3. Removes order from active orders
   */
  const handleReturnOrder = async (item) => {
    const userReturnOrdersRef = doc(
      collection(db, "users", userInfo.email, "returnOrders"),
      userInfo.id
    );

    try {
      const userReturnOrdersSnapshot = await getDoc(userReturnOrdersRef);

      if (userReturnOrdersSnapshot.exists()) {
        // Append to existing return orders
        const returnOrdersData = userReturnOrdersSnapshot.data().returnOrders;
        returnOrdersData.push(item);
        await updateDoc(userReturnOrdersRef, {
          returnOrders: returnOrdersData,
        });
        dispatch(addToreturnOrders(returnOrdersData));
      } else {
        // Create new return orders collection
        await setDoc(userReturnOrdersRef, { returnOrders: [item] });
        dispatch(addToreturnOrders([item]));
      }
    } catch (error) {
      console.error("Error saving orders to Firebase:", error);
    }

    // Remove from active orders
    handleUpdateOrder(item);
  };

  /**
   * Updates active orders after cancellation/return:
   * 1. Removes order from Firestore
   * 2. Updates context and Redux store
   */
  const handleUpdateOrder = async (item) => {
    const userOrdersRef = doc(
      collection(db, "users", userInfo.email, "orders"),
      userInfo.id
    );

    const userOrdersSnapshot = await getDoc(userOrdersRef);

    if (userOrdersSnapshot.exists()) {
      // Filter out the cancelled/returned order
      const userOrdersData = userOrdersSnapshot.data().orders;
      const updatedOrders = userOrdersData.filter(
        (order) => order.uniqueNumber !== item.uniqueNumber
      );

      // Update Firestore
      await updateDoc(userOrdersRef, { orders: updatedOrders });

      // Update context and Redux
      const updatedUserOrders = userOrders.filter(
        (order) => order.uniqueNumber !== item.uniqueNumber
      );
      updateUserOrders(updatedUserOrders);
      dispatch(addToOrders(updatedUserOrders));
    }
  };

  // ================ COMPONENT RENDER ================
  return (
    <div className="w-full relative py-6 flex flex-col gap-5 bg-white ">
      {/* =============== ORDER NAVIGATION TABS =============== */}
      <div className="w-full h-10 flex gap-7 pl-[8%] mdl:pl-[15%] text-base mdl:text-2xl">
        {/* Active Orders Tab */}
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

        {/* Cancelled Orders Tab */}
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

        {/* Returned Orders Tab */}
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

      {/* =============== ORDER CONTENT AREA =============== */}
      {/* Conditionally render based on active tab */}
      {showOrders && (
        <OrderDetails
          ordersData={reversedOrders}
          reversedOrders={reversedOrders}
          handleCancelOrder={handleCancelOrder}
          handleReturnOrder={handleReturnOrder}
        />
      )}

      {showCancelOrders && <OrderDetails ordersData={reversedCancelOrders} />}

      {showReturnOrders && <OrderDetails ordersData={reversedReturnOrders} />}
    </div>
  );
};

export default Orders;

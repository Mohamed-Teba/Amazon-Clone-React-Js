// Import React hooks for state management and side effects
import React, { useState, useEffect } from "react";
// Import Redux dispatch for state management
import { useDispatch } from "react-redux";
// Import React Router Link for navigation
import { Link } from "react-router-dom";
// Import Amazon logo for the checkout page
import { logoBlack } from "../../assets/index";
// Import Redux action for resetting buy now product
import { resetBuyNowProduct } from "../../Redux/amazonSlice";
// Import address context hook for user address management
import { useAddress } from "../../context/userAddressContext";
// Import AddressForm component for adding new addresses
import AddressForm from "./addressForm";
// Import UserAddresses component for displaying saved addresses
import UserAddresses from "./userAddresses";
// Import PaymentMethod component for payment options
import PaymentMethod from "./paymentMethod";
// Import OrderSummary component for order details
import OrderSummary from "./OrderSummary";

// Checkout component - Main checkout page with address, payment, and order summary
const Checkout = () => {
  // Redux dispatch function for state updates
  const dispatch = useDispatch();
  // Get user addresses from context
  const { userAddress } = useAddress();
  // State for controlling address form visibility
  const [showAddressForm, setShowAddressForm] = useState(
    userAddress.length === 0
  );

  // Effect to show address form if no addresses exist
  useEffect(() => {
    setShowAddressForm(userAddress.length === 0);
  }, [userAddress]);

  // Return the checkout page layout
  return (
    <div className="w-full h-full  bg-white ">
      {/* Header section with logo and page title */}
      <div className="relative flex flex-row justify-around items-center pt-[18px] pb-2 mx-5 border-b-[1px] shadow-inner-bottom">
        {/* Amazon logo link to home */}
        <Link to="/">
          <div
            onClick={() => dispatch(resetBuyNowProduct())}
            className="cursor-pointer px-2 h-12 flex items-center"
          >
            <img className="w-36 mt-2" src={logoBlack} alt="logo" />
          </div>
        </Link>
        {/* Page title */}
        <div className="">
          <h1 className="text-3xl font-semibold">Checkout</h1>
        </div>
      </div>

      {/* Main checkout content area */}
      <div className="flex flex-col mdl:flex-row mx-5 gap-6 mt-3 justify-center ">
        {/* Left column for address and payment */}
        <div className="mdl:w-[61%] ">
          {/* Conditional rendering of address form or saved addresses */}
          {showAddressForm || userAddress.length === 0 ? (
            // Show address form if no addresses exist or user wants to add new address
            <AddressForm setShowAddressForm={setShowAddressForm} />
          ) : (
            // Show saved addresses if addresses exist
            <UserAddresses setShowAddressForm={setShowAddressForm} />
          )}
          {/* Divider between address and payment sections */}
          <div className="mt-3 border-b border-gray-500"></div>

          {/* Payment method selection */}
          <PaymentMethod />
          {/* Divider after payment section */}
          <div className="mt-3 border-b border-gray-500"></div>
        </div>

        {/* Right column for order summary */}
        <div className="mdl:w-[22%] h-full sticky top-3">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

// Export the Checkout component as the default export
export default Checkout;

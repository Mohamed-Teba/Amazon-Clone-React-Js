// Import React hooks for state management and side effects
import React, { useState, useEffect } from "react";
// Import Material-UI icons for dropdown and cart functionality
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
// Import Amazon logo image
import { logo } from "../../assets/index";
// Import React Router Link for navigation
import { Link } from "react-router-dom";
// Import Redux actions for user authentication and order management
import {
  setUserAuthentication,
  userSignOut,
  resetOrders,
  resetCancelOrders,
  resetReturnOrders,
} from "../../Redux/amazonSlice";
// Import Firebase authentication functions
import { getAuth, signOut } from "firebase/auth";
// Import Redux hooks for state management
import { useDispatch, useSelector } from "react-redux";
// Import Pincode component for location selection
import Pincode from "./Pincode";
// Import useLoaderData for accessing route data
import { useLoaderData } from "react-router-dom";
// Import SignInoptions component for sign-in dropdown
import SignInoptions from "./SignInoptions";
// Import useCart hook for cart state management
import { useCart } from "../../context/userCartContext";
// Import logout icon from Material-UI
import LogoutIcon from "@mui/icons-material/Logout";
// Import Search component for product search functionality
import Search from "./Search";

// Header component - Main navigation bar of the application
const Header = () => {
  // Redux dispatch function for state updates
  const dispatch = useDispatch();
  // Firebase authentication instance
  const auth = getAuth();

  // Get cart total quantity from context
  const { cartTotalQty } = useCart();
  // Get product data from route loader
  const product = useLoaderData();
  const productsData = product.data.products;

  // Extract unique product categories for navigation
  var productCategories = [];
  productsData.forEach((product) => {
    if (!productCategories.includes(product.category)) {
      productCategories.push(product.category);
    }
  });

  // State for controlling sign-in dropdown visibility
  const [showSignin, setShowSignin] = useState(false);
  // Get products, user info, and authentication status from Redux store
  const products = useSelector((state) => state.amazon.products);
  const userInfo = useSelector((state) => state.amazon.userInfo);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);
  // State for cart quantity display
  const [quantity, setQuantity] = useState(0);

  // Calculate total quantity from products in cart
  useEffect(() => {
    let allQty = 0;
    products.forEach((product) => {
      allQty += product.quantity;
    });
    setQuantity(allQty);
  }, [products]);

  // Handle user logout functionality
  const handleLogout = () => {
    signOut(auth).then(() => {
      dispatch(userSignOut());
      dispatch(setUserAuthentication(false));
      dispatch(resetOrders());
      dispatch(resetCancelOrders());
      dispatch(resetReturnOrders());
    });
  };

  // Return the header navigation structure
  return (
    <>
      {/* Fixed header container with high z-index */}
      <div className="w-full fixed z-50 top-0">
        {/* Main header bar with Amazon blue background */}
        <div className="w-full bg-amazon_blue text-white px-2 py-2 flex items-center gap-1 xs:justify-evenly">
          {/* Amazon logo section */}
          <Link to="/">
            <div className="headerHover">
              <img className="sm:w-24 mt-2" src={logo} alt="logo" />
            </div>
          </Link>
          {/* End of Amazon logo section */}

          {/* Address/location selection section */}
          <Pincode />
          {/* End of address section */}

          {/* Search bar section - hidden on mobile */}
          <div className="w-[45%] hidden mdl:block">
            <Search />
          </div>
          {/* End of search section */}

          {/* Language selection section */}
          <div className="headerHover hidden lgl:inline-flex">
            <p className="flex">
              <img
                src="https://cdn-icons-png.flaticon.com/128/206/206606.png"
                alt="flag"
                className="w-[18px] mt-2 h-6"
              />
              <span className="pl-1 pt-[11px] font-bold text-sm">EN</span>
              <span className="pt-2">
                <ArrowDropDownIcon />
              </span>
            </p>
          </div>
          {/* End of language section */}

          {/* Sign-in/Account section */}
          <Link to="/Login">
            <div
              className="flex flex-col items-start justify-center headerHover"
              onMouseEnter={() => setShowSignin(true)}
              onMouseLeave={() => setShowSignin(false)}
            >
              {/* Display user name if logged in, otherwise show "Hello, Sign in" */}
              {userInfo ? (
                <p className="xs:text-xs md:text-xs lgl:text-base font-medium">
                  Hello, {userInfo.name}
                </p>
              ) : (
                <p className="xs:text-xs md:text-xs lgl:text-base font-medium">
                  Hello, Sign in
                </p>
              )}
              {/* Account and lists dropdown text */}
              <p className="lg:text-xs xl:text-sm font-semibold -mt-1 text-whiteText hidden lg:inline-flex">
                Accounts & Lists {""}
                <span>
                  <ArrowDropDownOutlinedIcon />
                </span>
              </p>

              {/* Sign-in dropdown overlay */}
              {showSignin && (
                <div className="w-full h-screen text-black fixed top-16 left-0 bg-amazon_blue bg-opacity-50 flex justify-end">
                  <div className="w-full absolute left-[40%] md:left-[45%] lgl:left-[60%]">
                    {/* Show different content based on authentication status */}
                    {userInfo ? (
                      // Logged in user dropdown
                      <div
                        onMouseLeave={() => setShowSignin(false)}
                        onClick={(e) => e.preventDefault()}
                        className="mdl:w-[50%] lgl:w-[32%] sml:w-[50%] mr-10 rounded-sm h-[96] overflow-hidden -mt-2 bg-white border border-transparent "
                      >
                        <SignInoptions />
                        {/* Logout options */}
                        <div className="flex flex-col gap-1 text-xs lgl:text-sm font-normal items-start mt-3 ml-[53%] ">
                          <hr className="w-32" />
                          <h4 className="hover:text-orange-500 hover:underline">
                            Switch Accounts
                          </h4>
                          <h4
                            className="hover:text-orange-500 hover:underline"
                            onClick={handleLogout}
                          >
                            Sign Out
                          </h4>
                        </div>
                      </div>
                    ) : (
                      // Guest user dropdown
                      <div
                        onMouseLeave={() => setShowSignin(false)}
                        onClick={(e) => e.preventDefault()}
                        className="mdl:w-[50%] lgl:w-[32%] sml:w-[50%] mr-10 rounded-sm  overflow-hidden sml:h-[60%] mdl:h-[55%] lg:h-[70%] lgl:h-[60%] -mt-2 bg-white border border-transparent "
                      >
                        {/* Sign in button and new customer link */}
                        <div className="flex flex-col justify-center gap-1 mb-2 mt-5 text-center">
                          <Link to="/Login">
                            <button className="w-60 h-8 text-sm bg-yellow-400 rounded-md py-1 font-semibold cursor-pointer">
                              Sign in
                            </button>
                          </Link>
                          <p className="text-xs">
                            New Customer?{""}
                            <Link to="/Login">
                              <span className="text-green-600 ml-1 cursor-pointer hover:text-orange-500 hover:underline">
                                Start here.
                              </span>
                            </Link>
                          </p>
                        </div>
                        <hr className="w-[80%] mx-auto" />
                        <SignInoptions />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Link>
          {/* End of sign-in section */}

          {/* Returns and Orders section */}
          <Link to={authenticated ? "/orders" : "/Login"}>
            <div className="lgl:flex flex-col items-start justify-center headerHover">
              <p className="text-xs mdl:text-sm font-medium">Returns</p>
              <p className="text-xs mdl:text-sm font-semibold -mt-1 text-whiteText">
                & Orders
              </p>
            </div>
          </Link>
          {/* End of returns and orders section */}

          {/* Shopping Cart section */}
          <Link to="/Cart">
            <div className="flex flex-row items-start justify-center headerHover pt-2 relative">
              <ShoppingCartOutlinedIcon />
              <p className="text-xs font-semibold mt-3 text-whiteText">
                Cart {/* Cart quantity badge */}
                <span className="absolute text-xs top-1 left-6 font-semibold p-1 h-4 bg-[#f3a847] text-amazon_blue rounded-full flex justify-center items-center">
                  {cartTotalQty > 0 ? cartTotalQty : quantity}
                </span>
              </p>
            </div>
          </Link>
          {/* End of cart section */}

          {/* Logout button - only visible when user is logged in */}
          {userInfo && (
            <div
              onClick={handleLogout}
              className="headerHover flex flex-col justify-center items-center relative"
            >
              <LogoutIcon />
              <p className="hidden mdl:inline-flex text-sm font-bold">Logout</p>
            </div>
          )}
          {/* End of logout section */}
        </div>

        {/* Mobile search bar - visible only on mobile devices */}
        <div className="mdl:hidden w-full pr-2 bg-amazon_blue text-white pb-2 flex flex-col px:[2%] sml:px-[5%]">
          <Search />
        </div>
      </div>
    </>
  );
};

// Export the Header component as the default export
export default Header;

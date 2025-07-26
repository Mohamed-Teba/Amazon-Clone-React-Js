// Import React hooks for state management and side effects
import React, { useRef, useEffect, useState } from "react";
// Import Material-UI icons for menu, close, and account
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// Import framer-motion for animations
import { motion } from "framer-motion";
// Import Redux hooks and actions for authentication
import { useSelector, useDispatch } from "react-redux";
// Import Link for navigation
import { Link } from "react-router-dom";
// Import Firebase authentication functions
import { getAuth, signOut } from "firebase/auth";
// Import useLoaderData for accessing product data
import { useLoaderData } from "react-router-dom";
import {
  setUserAuthentication,
  userSignOut,
  resetCancelOrders,
  resetReturnOrders,
  resetOrders,
} from "../../Redux/amazonSlice";

// HeaderBottom component - Renders the navigation bar and sidebar with categories
const HeaderBottom = () => {
  // Firebase authentication instance
  const auth = getAuth();
  // Redux dispatch for state updates
  const dispatch = useDispatch();
  // Get product data from route loader
  const product = useLoaderData();
  const productsData = product.data.products;
  // Extract unique product categories
  var productCategories = [];
  productsData.forEach((product) => {
    if (!productCategories.includes(product.category)) {
      productCategories.push(product.category);
    }
  });
  // Get user info from Redux store
  const userInfo = useSelector((state) => state.amazon.userInfo);
  // Ref for sidebar
  const ref = useRef();
  // State for sidebar visibility
  const [sidebar, setSideBar] = useState(false);
  // Effect to close sidebar when clicking outside
  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setSideBar(false);
      }
    });
  }, [ref, sidebar]);

  // Handle user logout
  const handleLogout = () => {
    signOut(auth).then(() => {
      dispatch(userSignOut());
      dispatch(setUserAuthentication(false));
      dispatch(resetOrders());
      dispatch(resetCancelOrders());
      dispatch(resetReturnOrders());
    });
  };
  // Render the navigation bar and sidebar
  return (
    <div className="w-full mt-28 mdl:mt-16 px-2 h-[36px] bg-amazon_light text-white flex items-center">
      {/* Navigation items start  */}
      <ul className="flex items-center gap-2 mdl:text-sm tracking-wide xs:text-xs">
        <li
          ref={ref}
          onClick={() => setSideBar(true)}
          className="headerHover h-8 mt-1 flex items-center gap-1"
        >
          <MenuIcon />
          All
        </li>
        <li className="headerHover h-8 mt-1">Amazon miniTV</li>
        <li className="headerHover h-8 mt-1">Sell</li>
        <li className="headerHover h-8 mt-1">Best Seller</li>
        <li className="headerHover h-8 mt-1">Today's Deals</li>
        <Link to="/Smartphones">
          <li className="headerHover h-8 mt-1">Mobiles</li>
        </Link>
      </ul>
      {/* Navigation items end  */}
      {/* Sidebar start  */}
      {sidebar && (
        <div className="w-full h-screen text-black fixed top-0 left-0 bg-amazon_blue bg-opacity-50 z-50 flex">
          <motion.div
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className=" xs:w-[65%] mdl:w-[35%] lgl:w-[25%] h-full bg-white border border-black"
          >
            {/* Sidebar header with user info */}
            <div className="w-full bg-amazon_light sticky top-0 left-0 text-white py-2 px-6 flex items-center gap-4">
              {userInfo ? (
                <img
                  src={userInfo.image}
                  className="w-10 h-10 rounded-full"
                  alt="user"
                />
              ) : (
                <AccountCircleIcon />
              )}

              {userInfo ? (
                <h3>Hello,{userInfo.name}</h3>
              ) : (
                <Link to="/Login">
                  <h3>Hello, Sign In</h3>
                </Link>
              )}
            </div>
            {/* Sidebar categories */}
            <h1 className="text-xl px-2 font-semibold py-3">Categories</h1>
            <hr className="py-1" />
            <div>
              <ul className="flex flex-col ml-3 justify-between py-2 cursor-pointer">
                {productCategories.map((category) => (
                  <Link to={`${category}`}>
                    <li
                      key={category.id}
                      className="text-lg tracking-wide font-normal p-1 border-b-[1px] border-b-transparent hover:bg-zinc-200 cursor-pointer duration-200 capitalize"
                    >
                      {category}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
            <hr className="py-1" />
            {/* Logout button for authenticated users */}
            {userInfo ? (
              <h4
                onClick={handleLogout}
                className="hover:text-orange-500 pb-4 ml-3 text-lg font-normal cursor-pointer"
              >
                Sign Out
              </h4>
            ) : (
              " "
            )}
          </motion.div>
          {/* Sidebar close button */}
          <div
            onClick={() => setSideBar(false)}
            className="w-10 absolute cursor-pointer h-10 ml-[69%] sml:ml-[51%] mdl:ml-[36%] lgl:ml-[26%] text-black flex items-center justify-center border bg-gray-200 hover:bg-red-500 hover:text-white duration-300"
          >
            <CloseIcon />
          </div>
        </div>
      )}

      {/* Sidebar end */}
    </div>
  );
};
// Export the HeaderBottom component as the default export
export default HeaderBottom;

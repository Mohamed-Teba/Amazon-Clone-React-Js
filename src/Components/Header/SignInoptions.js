import React from "react";
import { Link } from "react-router-dom";

const SignInoptions = () => {
  return (
    // Container for sign-in dropdown options, split into two columns
    <div className="grid grid-cols-2 my-1 ml-8">
      {/* Left column: User's lists section */}
      <div className="flex flex-col gap-2">
        {/* Section heading */}
        <h3 className="font-medium text-xs mdl:text-sm lgl:text-lg">
          Your Lists
        </h3>
        {/* List of actionable items */}
        <ul className="text-xs lgl:text-sm font-normal flex flex-col gap-3">
          <li className="hover:text-orange-500 hover:underline">
            Shopping List
          </li>
          <hr className="w-[80%]" />
          <li className="hover:text-orange-500 hover:underline">
            Create a WishList
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Wish from Any Website
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Baby Wishlist
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Discover Your Style
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Explore Showroom
          </li>
        </ul>
      </div>

      {/* Right column: User's account section */}
      <div className="flex flex-col gap-2">
        {/* Section heading */}
        <h3 className="font-medium text-xs mdl:text-sm lgl:text-lg">
          Your Account
        </h3>
        {/* List of account-related links */}
        <ul className="text-xs lgl:text-sm font-normal flex flex-col gap-2">
          <li className="hover:text-orange-500 hover:underline">
            Your Account
          </li>
          {/* Link to orders page */}
          <Link to="/orderDetails">
            <li className="hover:text-orange-500 hover:underline">
              Your Orders
            </li>
          </Link>
          <li className="hover:text-orange-500 hover:underline">
            Your Wishlist
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Your Recommendations
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Your Prime Membership
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Your Prime Video
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Your Subscribe & Save Items
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Memberships & Subscriptions
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Your Seller Account
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Manage Your Content and Devices
          </li>
          <li className="hover:text-orange-500 hover:underline">
            Your Free Amazon Business Account
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SignInoptions;

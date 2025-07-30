// Importing React library to use JSX
import React from "react";

// Importing Link component from react-router-dom to navigate to another page
import { Link } from "react-router-dom";

// Functional component to display when the cart is empty
const EmptyCart = () => {
  return (
    // Main container with padding, margin, background color, and responsive flex layout
    <div className="w-[90%] mdl:w-full  bg-white py-6 px-5 my-8 mx-5 flex flex-col mdl:flex-row justify-between items-start">
      {/* Left side: Image representing empty cart */}
      <div className="w-[90%] mdl:w-[50%] h-[60%]">
        <img
          src="https://m.media-amazon.com/images/G/31/cart/empty/kettle-desaturated._CB424694257_.svg"
          alt="emptyCart"
        />
      </div>


      {/* Right side: Text message and a button to redirect to product page */}
      <div className=" mdl:w-[50%] p-5 pl-8 flex flex-col gap-6">
        {/* Main title message */}
        <h1 className="text-4xl font-semibold">Your Amazon Cart is empty.</h1>

        {/* Sub-message with a motivational tone */}
        <h1 className="text-xl font-semibold ">
          An empty cart may seem like nothing, but it holds the promise of
          endless possibilities, waiting to be filled with the treasures of your
          desires and dreams.
        </h1>

        {/* Link that navigates user to the allProducts page */}
        <Link to="/allProducts">
          <div className="mdl:ml-[22%] mt-2">
            {/* Button that invites user to shop today's deals */}
            <button
              className="w-[100%] mdl:w-[320px] border-[1px] bg-gray-100 border-gray-200 py-1 text-sm text-blue-600 rounded-lg
                           text-center p-[4px] active:ring-2 active:ring-offset-1 active:ring-blue-600 "
            >
              Shop today’s deals
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

// Exporting the EmptyCart component to be used in other parts of the application
export default EmptyCart;

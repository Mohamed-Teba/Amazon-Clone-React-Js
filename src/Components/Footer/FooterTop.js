import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const FooterTop = () => {
  // Get user information from the Redux store
  const userInfo = useSelector((state) => state.amazon.userInfo);

  return (
    <>
      {/* If the user is not logged in, show the sign-in prompt */}
      {!userInfo && (
        <div className="w-full bg-white py-6">
          {/* Top and bottom border to separate this section visually */}
          <div className="w-full border-t-[1px] border-b-[1px] py-8">
            {/* Centered container with text and buttons */}
            <div className="w-64 mx-auto text-center flex flex-col gap-1">
              {/* Prompt message */}
              <p className="text-sm">See Personalised Recommendation</p>

              {/* Sign in button redirects to Login page */}
              <Link to="/Login">
                <button className="w-60 ml-3 h-8 text-sm bg-yellow-400 rounded-md py-1 font-semibold cursor-pointer">
                  Sign in
                </button>
              </Link>

              {/* Link to SignUp page for new users */}
              <p className="text-xs">
                New Customer?
                <Link to="/SignUp">
                  <span className="text-green-600 ml-1 cursor-pointer">
                    Start here.
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterTop;

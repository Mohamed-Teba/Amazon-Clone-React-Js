import React, { useState } from "react";
import { logoBlack } from "../../assets/index";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  // State for the input value (email or mobile)
  const [input, setInput] = useState("");
  // State for validation error message
  const [error, setError] = useState("");

  // Validate input against email or 10‑digit mobile pattern
  const validate = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^[0-9]{10}$/;
    if (!emailPattern.test(input) && !mobilePattern.test(input)) {
      setError(
        "We're sorry. We weren't able to identify you given the information provided."
      );
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    validate(); // Run validation
    setInput(""); // Clear the input field
  };

  return (
    <div className="bg-white">
      {/* Logo linking back to homepage */}
      <div className="flex flex-col justify-center items-center">
        <Link to="/">
          <div className="headerHover">
            <img className="w-36 mt-2" src={logoBlack} alt="logo" />
          </div>
        </Link>

        {/* Password assistance form container */}
        <div className="w-80 mt-4 border rounded-lg">
          <div className="my-4 mx-5">
            {/* Title */}
            <span className="text-2xl font-semibold">Password assistance</span>
            {/* Instruction text */}
            <div className="text-sm font-medium tracking-wide mt-2">
              Enter the email address or mobile phone number associated with
              your Amazon account.
            </div>

            {/* Form for email or phone input */}
            <form onSubmit={handleSubmit} className="my-3">
              <label className="text-sm font-semibold flex flex-col gap-1">
                Email or mobile phone number
                <input
                  type="text"
                  value={input}
                  autoComplete="true"
                  onChange={(e) => {
                    setInput(e.target.value);
                    setError("");
                  }}
                  className="w-full border border-[#a6a6a6] rounded p-1"
                />
              </label>

              {/* Continue button */}
              <button className="text-sm w-full text-center rounded-lg bg-yellow-300 hover:bg-yellow-400 p-2 mt-4 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500">
                Continue
              </button>
            </form>

            {/* Display validation error if any */}
            {error && <div className="text-xs text-red-600">{error}</div>}
          </div>
        </div>

        {/* Additional guidance text */}
        <div className="w-80 mt-2 text-md leading-5 pl-3 font-medium">
          Has your email address or mobile phone number changed?
        </div>
        <div className="w-80 text-sm mx-auto mt-1 pl-3 mb-8">
          If you no longer use the e‑mail address associated with your Amazon
          account, you may contact Customer Service for help restoring access to
          your account.
        </div>
      </div>

      {/* Footer links */}
      <hr className="w-11/12 mx-auto" />
      <div className="flex gap-4 justify-center text-xs mx-auto mt-10 text-black tracking-wide pt-5">
        <a
          href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_signin_notification_condition_of_use?ie=UTF8&nodeId=200545940"
          className="text-blue-500 hover:text-red-500"
        >
          Conditions of Use
        </a>
        <a
          href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_signin_notification_privacy_notice?ie=UTF8&nodeId=200534380"
          className="text-blue-500 hover:text-red-500"
        >
          Privacy Notice
        </a>
        <p className="text-blue-500 hover:text-red-500 cursor-pointer">
          Interest‑Based Ads
        </p>
      </div>

      {/* Copyright notice */}
      <div className="text-xs tracking-wider text-black flex justify-center mt-4 pb-16">
        © 1996‑2023, Amazon.com, Inc. or its affiliates
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from "react";
// Asset imports for icons and images
import { info, exclamation } from "../../assets";

// Firebase Authentication functions
import {
  getAuth,
  updateProfile,
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// React Router for navigation
import { Link } from "react-router-dom";

// Firestore functions and configuration
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

// Material UI icon for arrows
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

// Loading spinner component
import { RotatingLines } from "react-loader-spinner";

// SignUp component handles user registration flow
const SignUp = () => {
  // Local state for loading indicator
  const [loading, setLoading] = useState(false);
  // Message on successful account creation
  const [successMsg, setSuccessMsg] = useState("");
  // Firebase auth instance
  const auth = getAuth();

  // Error states for Firebase and form fields
  const [firebaseError, setFirebaseError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  /**
   * saveUserDataToFirebase
   * Persists new user data in Firestore under 'users/{uid}'.
   * Merges with existing document if present.
   */
  const saveUserDataToFirebase = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // Only write if no existing document
    if (!userSnap.exists()) {
      await setDoc(
        userRef,
        {
          id: user.uid,
          name: user.displayName || "",
          email: user.email,
          image: user.photoURL,
          mobile: user.phoneNumber || "",
          createdOn: new Date(),
        },
        { merge: true }
      );
    }
  };

  /**
   * emailValidation
   * Validates email against a general regex pattern.
   * Returns match array or null.
   */
  const emailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
  };

  /**
   * validate
   * Performs client-side validation on name, email, and password.
   * Sets appropriate error messages and returns boolean validity.
   */
  const validate = () => {
    const reqpassword = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.(com)$/;

    let isvalid = true;

    // Validate name input
    if (!inputValue) {
      setErrorMessage("Enter Name");
      isvalid = false;
    }

    // Validate email input
    if (!email) {
      setErrorEmail("Email is required");
      isvalid = false;
    } else if (!emailPattern.test(email)) {
      setErrorEmail("Email must be  letters +  numbers + @domain.com");
      isvalid = false;
    } else if (!emailValidation(email)) {
      setErrorEmail("Enter a valid email");
      isvalid = false;
    }

    // Validate password input
    if (!password) {
      setErrorPassword("Enter your password");
      isvalid = false;
    } else if (!reqpassword.test(password)) {
      setErrorPassword(
        "Password must be at least 8 characters and contain at least one uppercase letter and one special character."
      );
      isvalid = false;
    }

    return isvalid;
  };

  // Handlers for updating form fields and clearing previous errors
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setErrorMessage("");
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrorEmail("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrorPassword("");
  };

  /**
   * handleSubmit
   * Prevents default form submission, validates inputs,
   * then creates a Firebase user, updates profile,
   * saves to Firestore, and sends verification email.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const isvalid = validate();
    if (!isvalid) return;

    setLoading(true);

    // Proceed if credentials are provided
    if (email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          // Update Firebase Auth profile
          await updateProfile(auth.currentUser, {
            displayName: inputValue,
            photoURL:
              "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp",
          });

          // Persist user data in Firestore
          await saveUserDataToFirebase(user);

          // Send email verification link
          await sendEmailVerification(auth.currentUser);

          setSuccessMsg("Account Created Successfully");
          // Reset form fields on success
          setInputValue("");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          // Handle specific Firebase errors
          const errorCode = error.code;
          if (errorCode.includes("auth/email-already-in-use")) {
            setFirebaseError("Email is already in use ! Try another one");
          } else {
            setFirebaseError("Something went wrong. Please try again.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // JSX markup for sign-up form and conditional success message
  return (
    <div className="flex flex-col w-full h-auto">
      {/* Logo linking back to home */}
      <Link to="/">
        <img
          className="m-auto w-52"
          alt=""
          src="https://api.freelogodesign.org/assets/blog/img/20180911090509731amazon_logo_RGB.jpg"
        />
      </Link>

      {/* Container for form or success message */}
      <div className="border border-1 border-gray-300 w-96 rounded-md m-auto h-auto px-4 py-4">
        <span className="text-3xl font-normal">Create Account</span>

        {/* Show success notification if signup completed */}
        {successMsg ? (
          <div className="mt-3">
            <li className="text-base font-semibold text-green-600 ">
              Account Created Successfully!
            </li>
          </div>
        ) : (
          // Render signup form when no success message
          <form
            className="mt-3 text-xs font-bold mb-4 flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* Name input field */}
            <div className="flex flex-col gap-1 h-auto">
              Your Name
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-sm h-7 font-normal p-2"
                placeholder="First and Last Name"
              />
              {/* Display validation error for name */}
              {errorMessage && (
                <div className="text-xs font-normal italic text-red-500 pl-2 flex flex-row">
                  <img
                    className="w-4 text-red-500"
                    src={exclamation}
                    alt="info"
                  />
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>

            {/* Email input field */}
            <div className="flex flex-col">
              Email
              <input
                type="text"
                value={email}
                onChange={handleEmail}
                className="border border-gray-400 rounded-sm h-7 font-normal p-2"
              />
              {/* Display validation or Firebase error for email */}
              {(errorEmail || firebaseError) && (
                <div className="text-xs font-normal italic text-red-500 pl-2 flex flex-row">
                  <img
                    className="w-4 text-red-500"
                    src={exclamation}
                    alt="info"
                  />
                  <p>{errorEmail || firebaseError}</p>
                </div>
              )}
            </div>

            {/* Password input field */}
            <div className="flex flex-col">
              Password
              <input
                type="password"
                value={password}
                onChange={handlePassword}
                className="border border-gray-400 rounded-sm h-7 font-normal p-2"
                placeholder="At least 8 characters"
              />
              {/* Display validation error for password */}
              {errorPassword && (
                <div className="text-xs font-normal italic text-red-500 pl-2 flex flex-row">
                  <img
                    className="w-4 text-red-500"
                    src={exclamation}
                    alt="info"
                  />
                  <p>{errorPassword}</p>
                </div>
              )}
              {/* Informational note about password requirements */}
              <span className="flex items-center">
                <img className="w-3 h-4" src={info} alt="info" />
                <p className="pl-1 font-normal">
                  Password must be atleast 8 characters.
                </p>
              </span>
              {/* Terms notice for SMS notifications */}
              <p className="mt-4 font-normal text-sm">
                By enrolling your mobile phone number, you consent to receive
                automated security notifications via text message from Amazon.
                Message and data rates may apply.
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="bg-yellow-300 p-2 rounded-md font-medium tracking-wide"
            >
              Continue
            </button>

            {/* Placeholder for reCAPTCHA if implemented */}
            <div id="recaptcha-container"></div>

            {/* Loading spinner displayed during async operations */}
            {loading && (
              <div className="flex justify-center ">
                <RotatingLines
                  strokeColor="orange"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={true}
                />
              </div>
            )}
          </form>
        )}

        {/* Links for existing account and business account creation */}
        <Link to="/Login">
          <p className="text-xs tracking-wider mt-4">
            Already have an account?
            <span className="text-blue-700 font-medium hover:text-red-600 hover:underline cursor-pointer">
              Sign in
              <span className="text-blue-500 -ml-1 hover:text-red-600">
                <ArrowRightIcon />
              </span>
            </span>
          </p>
        </Link>
        <p className="text-xs tracking-wider">
          Buying for work?
          <span className="text-blue-700 hover:text-red-600 font-medium hover:underline cursor-pointer">
            Create a free business account
            <span className="text-blue-500 -ml-1 hover:text-red-600">
              <ArrowRightIcon />
            </span>
          </span>
        </p>

        {/* Legal and policy links */}
        <p className="text-xs tracking-wider mt-5">
          By Creating or logging in, you agree to Amazon's
          <span className="text-blue-700 font-medium hover:text-red-600 hover:underline cursor-pointer">
            Conditions of Use
          </span>{" "}
          and
          <span className="text-blue-700 font-medium hover:text-red-600 hover:underline cursor-pointer">
            Privacy Policy.
          </span>
        </p>
      </div>

      {/* Footer navigation links */}
      <hr className="block mt-8 m-auto w-80" />
      <div className="flex justify-evenly w-80 m-auto mt-5">
        <a
          href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_desktop_footer_cou?ie=UTF8&nodeId=200545940"
          className=" text-blue-700 text-xs font-medium hover:text-red-600 hover:underline"
        >
          Conditions of use
        </a>
        <a
          href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_desktop_footer_privacy_notice?ie=UTF8&nodeId=200534380"
          className="text-blue-700 text-xs font-medium hover:text-red-600 hover:underline"
        >
          Privacy Notice
        </a>
        <a
          href="https://www.amazon.in/gp/help/customer/display.html?ie=UTF8&nodeId=508510"
          className="text-blue-700 text-xs font-medium hover:text-red-600 hover:underline"
        >
          Help
        </a>
      </div>

      {/* Copyright notice */}
      <div className="mx-auto text-xs mt-3">
        © 1996-2025, Amazon.com, Inc. or its affiliates
      </div>
    </div>
  );
};

export default SignUp;

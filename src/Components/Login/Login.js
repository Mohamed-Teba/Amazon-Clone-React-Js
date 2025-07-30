import React, { useState, useEffect } from "react";
import { logoBlack } from "../../assets/index";
import { Link, useNavigate } from "react-router-dom";
import { right, down, info } from "../../assets/index";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserInfo,
  setUserAuthentication,
  resetCart,
  addToOrders,
  addTocancelOrders,
  addToreturnOrders,
} from "../../Redux/amazonSlice";
import { db } from "../../firebase.config";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { useCart } from "../../context/userCartContext";
import { useOrders } from "../../context/userOrderContext";

const SignIn = () => {
  // ================ STATE AND CONTEXT MANAGEMENT ================
  const dispatch = useDispatch(); // Redux dispatch function
  const cartItems = useSelector((state) => state.amazon.products); // Access cart items from Redux store
  const { updateUserCart } = useCart(); // Cart context method
  const { updateUserOrders } = useOrders(); // Orders context method
  const auth = getAuth(); // Firebase authentication instance
  const navigate = useNavigate(); // Navigation hook

  // ================ UI STATE MANAGEMENT ================
  const [isClicked, setIsClicked] = useState(false); // Button click animation state
  const [needHelp, setNeedHelp] = useState(false); // Help section toggle state

  // Toggle help section visibility
  const handleNeedHelp = () => {
    setNeedHelp(!needHelp);
  };

  // Handle button click effect
  const handleNewClickEffect = (e) => {
    e.stopPropagation();
    setIsClicked(true);
  };

  // Close help section when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.classList.contains("clicked")) {
        setIsClicked(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // ================ FORM STATE AND VALIDATION ================
  const [warningPassword, setWarningPassword] = useState(""); // Password error message
  const [inputValue, setInputValue] = useState(""); // Email input value
  const [passwordValue, setPasswordValue] = useState(""); // Password input value
  const [userEmailError, setUserEmailError] = useState(""); // Email error message
  const [loading, setLoading] = useState(false); // Loading state
  const [successMsg, setSuccessMsg] = useState(""); // Success message

  // Validate form inputs
  const validate = () => {
    let isValid = true;
    if (inputValue === "") {
      setUserEmailError("Enter your email or mobile number");
      isValid = false;
    }
    if (passwordValue === "") {
      setWarningPassword("Enter your password");
      isValid = false;
    }
    return isValid;
  };

  // ================ FIREBASE DATA OPERATIONS ================
  // Fetch user orders from Firestore
  const fetchOrdersFromFirebase = async (user) => {
    const orderRef = doc(
      collection(db, "users", user.email, "orders"),
      user.uid
    );
    const docSnapshot = await getDoc(orderRef);
    const ordersFromFirebase = docSnapshot.exists()
      ? docSnapshot.data().orders
      : [];
    updateUserOrders(ordersFromFirebase);
    dispatch(addToOrders(ordersFromFirebase));
  };

  // Fetch canceled orders from Firestore
  const fetchCancelOrdersFromFirebase = async (user) => {
    const cancelRef = doc(
      collection(db, "users", user.email, "cancelOrders"),
      user.uid
    );
    const docSnapshot = await getDoc(cancelRef);
    const cancelledOrders = docSnapshot.exists()
      ? docSnapshot.data().cancelOrders
      : [];
    dispatch(addTocancelOrders(cancelledOrders));
  };

  // Fetch returned orders from Firestore
  const fetchReturnedOrdersFromFirebase = async (user) => {
    const returnRef = doc(
      collection(db, "users", user.email, "returnOrders"),
      user.uid
    );
    const docSnapshot = await getDoc(returnRef);
    const returnedOrders = docSnapshot.exists()
      ? docSnapshot.data().returnOrders
      : [];
    dispatch(addToreturnOrders(returnedOrders));
  };

  // Handle user after successful authentication
  const handleUser = (user) => {
    dispatch(
      setUserInfo({
        id: user.uid,
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
      })
    );
    dispatch(setUserAuthentication(true));
    saveUserDataToFirebase(user);
    saveLocalCartToFirebase(user);
    fetchOrdersFromFirebase(user);
    fetchCancelOrdersFromFirebase(user);
    fetchReturnedOrdersFromFirebase(user);
    setLoading(false);
    setSuccessMsg("Successfully Logged-in! Welcome back.");
    setTimeout(() => {
      navigate(-1); // Navigate back after successful login
    }, 2000);
  };

  // Save user details to Firestore
  const saveUserDataToFirebase = async (user) => {
    const userDetailsRef = doc(
      collection(db, "users", user.email, "details"),
      user.uid
    );
    const userDetailsSnapshot = await getDoc(userDetailsRef);
    if (!userDetailsSnapshot.exists()) {
      await setDoc(
        userDetailsRef,
        {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
          mobile: user.phoneNumber,
          createdOn: new Date(),
        },
        { merge: true }
      );
    }
  };

  // Merge local cart with Firebase cart
  const saveLocalCartToFirebase = async (user) => {
    const cartRef = doc(collection(db, "users", user.email, "cart"), user.uid);
    const docSnapshot = await getDoc(cartRef);
    const firebaseCartItems = docSnapshot.exists()
      ? docSnapshot.data().cart
      : [];
    const localCartItems = cartItems;

    // Merge local cart items with Firebase cart
    localCartItems.forEach((localItem) => {
      const cartIItemIndex = firebaseCartItems.findIndex(
        (item) => item.title === localItem.title
      );
      if (cartIItemIndex < 0) {
        firebaseCartItems.push(localItem);
      } else {
        firebaseCartItems[cartIItemIndex].quantity += localItem.quantity;
      }
    });

    await setDoc(cartRef, { cart: [...firebaseCartItems] });
    updateUserCart([...firebaseCartItems]);
    dispatch(resetCart()); // Clear local cart after merge
  };

  // ================ FORM SUBMISSION HANDLER ================
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    setLoading(true);
    signInWithEmailAndPassword(auth, inputValue, passwordValue)
      .then((userCredential) => {
        const user = userCredential.user;
        handleUser(user); // Process authenticated user
      })
      .catch((error) => {
        const errorCode = error.code;
        setLoading(false);

        // Handle specific authentication errors
        if (errorCode.includes("auth/invalid-email")) {
          setUserEmailError("Enter a valid Email");
        }
        if (errorCode.includes("auth/user-not-found")) {
          setUserEmailError("Invalid Email! User not found.");
        }
        if (errorCode.includes("auth/wrong-password")) {
          setWarningPassword("There was a problem. Your password is incorrect");
        }
        console.log("Authentication error:", errorCode);
      });

    // Clear form fields
    setInputValue("");
    setPasswordValue("");
  };

  // ================ RENDER COMPONENT ================
  return (
    <div className="bg-white w-full h-full">
      {/* Logo Section */}
      <div className="flex flex-col justify-center items-center">
        <Link to="/">
          <div className="headerHover">
            <img className="w-36 mt-2" src={logoBlack} alt="Amazon Logo" />
          </div>
        </Link>

        {/* Sign-in Form Container */}
        <div className="w-80 mt-4 border-[1px] rounded-lg">
          <div className="my-4 mx-7 ">
            <span className="text-[28px] font-semibold">Sign in</span>

            {/* Success Message Display */}
            {successMsg ? (
              <div className="">
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 10, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-base font-semibold text-green-600 border-[1px] my-8 text-center"
                >
                  {successMsg}
                </motion.p>
              </div>
            ) : (
              /* Login Form */
              <div>
                <div className="flex items-center justify-between ">
                  <div className="w-[45%]">
                    <hr />
                  </div>
                  <p className="text-sm font-semibold">Or</p>
                  <div className="w-[45%]">
                    <hr />
                  </div>
                </div>

                {/* Form Elements */}
                <form className="mt-2 mb-3" onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <label className="text-sm font-semibold">
                    Email
                    <input
                      type="text"
                      autoComplete="true"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setUserEmailError("");
                      }}
                      className="w-full border-[1px] border-[#a6a6a6] rounded p-1"
                    />
                  </label>
                  {userEmailError && (
                    <div className="flex items-center pt-1 pb-2">
                      <img src={info} className="w-4 h-4 mr-1" alt="warning" />
                      <div className="text-xs text-[#FF0000]">
                        {userEmailError}
                      </div>
                    </div>
                  )}

                  {/* Password Input */}
                  <label className="text-sm font-semibold">
                    Password
                    <input
                      type="password"
                      autoComplete="true"
                      value={passwordValue}
                      onChange={(e) => {
                        setPasswordValue(e.target.value);
                        setWarningPassword("");
                      }}
                      className="w-full border-[1px] border-[#a6a6a6] rounded p-1"
                    />
                  </label>
                  {warningPassword && (
                    <div className="flex items-center pt-1 pb-2">
                      <img src={info} className="w-4 h-4 mr-1" alt="warning" />
                      <div className="text-xs text-[#FF0000]">
                        {warningPassword}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    className={`${
                      isClicked ? "clicked" : ""
                    } text-sm my-4 w-full text-center rounded-lg bg-yellow-300 hover:bg-yellow-400 p-[6px]`}
                    onClick={(e) => {
                      handleNewClickEffect(e);
                    }}
                  >
                    Continue
                  </button>

                  {/* Loading Indicator */}
                  {loading && (
                    <div className="flex justify-center">
                      <RotatingLines
                        strokeColor="#febd69"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="50"
                        visible={true}
                      />
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="text-xs tracking-wide ">
              <span className="">
                By continuing, you agree to Amazon's
                <a
                  href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_signin_notification_condition_of_use?ie=UTF8&nodeId=200545940"
                  className="text-blue-500 hover:text-red-500 cursor-pointer"
                >
                  {" "}
                  Conditions of Use{" "}
                </a>
                and
                <a
                  href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_signin_notification_privacy_notice?ie=UTF8&nodeId=200534380"
                  className="text-blue-500 hover:text-red-500 cursor-pointer"
                >
                  {" "}
                  Privacy Notice
                </a>
                .
              </span>
            </div>

            {/* Help Section Toggle */}
            <div
              className="flex items-center gap-2 mt-7 cursor-pointer group "
              onClick={handleNeedHelp}
            >
              <div className="w-2 h-2 text-gray-200">
                {needHelp ? (
                  <img src={down} alt="Expand" />
                ) : (
                  <img src={right} alt="Collapse" />
                )}
              </div>
              <div className="text-xs text-blue-500 group-hover:underline group-hover:text-red-500">
                Need help?
              </div>
            </div>

            {/* Forgot Password Link */}
            {needHelp && (
              <div className="text-xs text-blue-500 cursor-pointer hover:underline hover:text-red-500 ml-4 mt-2 mb-5">
                <Link to="forgotPassword">Forgot password</Link>
              </div>
            )}
          </div>
        </div>

        {/* Create Account Section */}
        <div className="text-sm text-gray-500 my-4">New to Amazon?</div>
        <div className="w-80 text-[12px] font-medium tracking-wide text-center border-[1px] rounded-lg p-[5px] hover:bg-gray-100 mb-7 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500">
          <Link to="/createAccount">
            <div>Create your Amazon account</div>
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <hr className="w-11/12 mx-auto" />
      <div className="flex flex-row text-[11px] gap-4 mx-auto text-white justify-center tracking-wide pt-5 my-4">
        <a
          href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_signin_notification_condition_of_use?ie=UTF8&nodeId=200545940"
          className="text-blue-500 hover:text-red-500 cursor-pointer"
        >
          Conditions of Use
        </a>
        <a
          href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_signin_notification_privacy_notice?ie=UTF8&nodeId=200534380"
          className="text-blue-500 hover:text-red-500 cursor-pointer"
        >
          Privacy Notice
        </a>
        <p className="text-blue-500 hover:text-red-500 cursor-pointer">
          Interest-Based Ads
        </p>
      </div>
      <div className="text-xs tracking-wider text-black flex justify-center mt-[4px] pb-16">
        © 1996-2025, Amazon.com, Inc. or its affiliates
      </div>
    </div>
  );
};

export default SignIn;

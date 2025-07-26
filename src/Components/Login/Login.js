// Import React hooks for state management and side effects
import React, { useState, useEffect } from "react";
// Import Amazon logo for the login page
import { logoBlack } from "../../assets/index";
// Import React Router hooks for navigation
import { Link, useNavigate } from "react-router-dom";
// Import icons and images for the login interface
import { right, down, info, google, facebook } from "../../assets/index";
// Import loading spinner component
import { RotatingLines } from "react-loader-spinner";
// Import framer-motion for animations
import { motion } from "framer-motion";
// Import Firebase authentication functions
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithCredential,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
// Import Redux hooks for state management
import { useDispatch, useSelector } from "react-redux";
// Import Redux actions for user management
import {
  setUserInfo,
  setUserAuthentication,
  resetCart,
  addToOrders,
  addTocancelOrders,
  addToreturnOrders,
} from "../../Redux/amazonSlice";
// Import Firebase database configuration
import { db } from "../../firebase.config";
// Import Firestore functions for database operations
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
// Import cart context hook
import { useCart } from "../../context/userCartContext";
// Import orders context hook
import { useOrders } from "../../context/userOrderContext";
// Import Firebase auth state listener
import { onAuthStateChanged } from "firebase/auth";

// SignIn component - Main login page with email/password and social authentication
const SignIn = () => {
  // Redux dispatch function for state updates
  const dispatch = useDispatch();
  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.amazon.products);
  // Get cart update function from context
  const { updateUserCart } = useCart();
  // Get orders update function from context
  const { updateUserOrders } = useOrders();
  // Firebase authentication instance
  const auth = getAuth();
  // Google authentication provider
  const googleProvider = new GoogleAuthProvider();
  // Facebook authentication provider
  const facebookProvider = new FacebookAuthProvider();
  // Navigation function
  const navigate = useNavigate();

  // State for button click effects
  const [isClicked, setIsClicked] = useState(false);
  // State for help section visibility
  const [needHelp, setNeedHelp] = useState(false);

  // Toggle help section visibility
  const handleNeedHelp = () => {
    setNeedHelp(!needHelp);
  };

  // Handle button click effect
  const handleNewClickEffect = (e) => {
    e.stopPropagation();
    setIsClicked(true);
  };

  // Effect for handling clicks outside the button
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

  // State for form validation and user input
  const [warningPassword, setWarningPassword] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [userEmailError, setUserEmailError] = useState("");

  // Form validation function
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

  // Fetch user orders from Firebase
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

  // Fetch cancelled orders from Firebase
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

  // Fetch returned orders from Firebase
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

  // Handle successful user authentication
  const handleUser = (user) => {
    // Set user info in Redux store
    dispatch(
      setUserInfo({
        id: user.uid,
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
      })
    );
    // Set authentication status
    dispatch(setUserAuthentication(true));
    // Save user data to Firebase
    saveUserDataToFirebase(user);
    // Sync local cart with Firebase
    saveLocalCartToFirebase(user);
    // Fetch user data from Firebase
    fetchOrdersFromFirebase(user);
    fetchCancelOrdersFromFirebase(user);
    fetchReturnedOrdersFromFirebase(user);
    // Update UI state
    setLoading(false);
    setSuccessMsg("Successfully Logged-in! Welcome back.");
    // Navigate back after successful login
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  // State for loading and success messages
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Save user details to Firebase
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

  // Sync local cart with Firebase cart
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
    // Save merged cart to Firebase
    await setDoc(cartRef, { cart: [...firebaseCartItems] });
    updateUserCart([...firebaseCartItems]);
    dispatch(resetCart());
  };

  // Handle form submission for email/password login
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    setLoading(true);

    // Sign in with email and password
    signInWithEmailAndPassword(auth, inputValue, passwordValue)
      .then(() => {
        // Wait for authentication state change
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            handleUser(user);
            unsubscribe(); // Unsubscribe to avoid memory leaks
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        setLoading(false);
        // Handle different authentication errors
        if (errorCode.includes("auth/invalid-email")) {
          setUserEmailError("Enter a valid Email");
        }
        if (errorCode.includes("auth/user-not-found")) {
          setUserEmailError("Invalid Email! User not found.");
        }
        if (errorCode.includes("auth/wrong-password")) {
          setWarningPassword("There was a problem.Your password is incorrect");
        }
        console.log("Login error: ", errorCode);
      });

    // Clear form inputs
    setInputValue("");
    setPasswordValue("");
  };

  // Handle Google authentication
  const handleGoogle = async () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      const user = result.user;
      handleUser(user);
    });
  };

  // Handle Facebook authentication with account linking
  const handleFacebook = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;
        user.emailVerified = true;
        handleUser(user);
      })
      .catch((error) => {
        // Handle account linking for existing users
        if (error.code === "auth/account-exists-with-different-credential") {
          const pendingCred = FacebookAuthProvider.credentialFromError(error);
          const email = error.customData.email;
          fetchSignInMethodsForEmail(auth, email).then((methods) => {
            console.log(methods);
            // Link with Google account if exists
            if (methods[0] === "google.com") {
              signInWithPopup(auth, googleProvider).then((userCredential) => {
                const data = userCredential.user;
                linkWithCredential(data, pendingCred).then((result) => {
                  const user = result.user;
                  user.emailVerified = true;
                  handleUser(user);
                });
              });
            }
            // Link with email/password account if exists
            if (methods[0] === "password") {
              var password = prompt(
                "Email associated with your Facebook has already account on Amazon. Please enter your Amazon password to link your Facebook account to your Amazon account."
              );
              signInWithEmailAndPassword(auth, email, password).then(
                (userCredential) => {
                  const data = userCredential.user;
                  linkWithCredential(data, pendingCred).then((result) => {
                    const user = result.user;
                    user.emailVerified = true;
                    handleUser(user);
                  });
                }
              );
            }
          });
        }
      });
  };

  // Return the login page layout
  return (
    <div className="bg-white w-full h-full">
      <div className="flex flex-col justify-center items-center">
        {/* Amazon logo link to home */}
        <Link to="/">
          <div className="headerHover">
            <img className="w-36 mt-2" src={logoBlack} alt="logo" />
          </div>
        </Link>

        {/* Main login form container */}
        <div className="w-80 mt-4 border-[1px] rounded-lg">
          <div className="my-4 mx-7 ">
            {/* Page title */}
            <span className="text-[28px] font-semibold">Sign in</span>

            {/* Success message display */}
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
              <div>
                {/* Google sign-in button */}
                <div
                  onClick={() => {
                    handleGoogle();
                  }}
                  className=" cursor-pointer flex flex-row items-center my-3 border-[1px] p-[6px] border-black rounded-md hover:bg-slate-100 active:ring-2 active:ring-offset-1 active:ring-blue-600 active:border-transparent"
                >
                  <img src={google} alt="google" className="w-5 h-5 mx-5" />
                  <p className="text-sm font-semibold">Continue with Google</p>
                </div>

                {/* Facebook sign-in button */}
                <div
                  onClick={handleFacebook}
                  className="cursor-pointer flex flex-row items-center  my-3 border-[1px] p-[6px] border-black rounded-md hover:bg-slate-100 active:ring-2 active:ring-offset-1 active:ring-blue-600 active:border-transparent"
                >
                  <img src={facebook} alt="facebook" className="w-5 mx-5 h-5" />
                  <p className="text-sm font-semibold">
                    Continue with Facebook
                  </p>
                </div>

                {/* Divider between social and email login */}
                <div className="flex items-center justify-between ">
                  <div className="w-[45%]">
                    <hr />
                  </div>
                  <p className="text-sm font-semibold">Or</p>
                  <div className="w-[45%]">
                    <hr />
                  </div>
                </div>

                {/* Email/password login form */}
                <form className="mt-2 mb-3" onSubmit={handleSubmit}>
                  {/* Email input field */}
                  <label className="text-sm font-semibold">
                    Email or mobile number
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
                  {/* Email error display */}
                  {userEmailError && (
                    <div className="flex  items-center  pt-1 pb-2">
                      <img src={info} className="w-4 h-4 mr-1" alt="warning" />
                      <div className="text-xs text-[#FF0000]">
                        {userEmailError}
                      </div>
                    </div>
                  )}

                  {/* Password input field */}
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
                  {/* Password error display */}
                  {warningPassword && (
                    <div className="flex  items-center pt-1 pb-2">
                      <img src={info} className="w-4 h-4 mr-1" alt="warning" />
                      <div className="text-xs text-[#FF0000]">
                        {warningPassword}
                      </div>
                    </div>
                  )}

                  {/* Continue button */}
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

                  {/* Loading spinner */}
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

            {/* Terms and conditions text */}
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

            {/* Help section */}
            <div
              className="flex items-center gap-2 mt-7 cursor-pointer group "
              onClick={handleNeedHelp}
            >
              <div className="w-2 h-2 text-gray-200">
                {needHelp ? (
                  <img src={down} alt="down" />
                ) : (
                  <img src={right} alt="right" />
                )}
              </div>
              <div className=" text-xs  text-blue-500 group-hover:underline group-hover:text-red-500">
                Need help?
              </div>
            </div>
            {/* Forgot password link */}
            {needHelp ? (
              <div className=" text-xs  text-blue-500 cursor-pointer hover:underline hover:text-red-500 ml-4 mt-2 mb-5">
                <Link to="forgotPassword">Forgot password</Link>
              </div>
            ) : null}
          </div>
        </div>

        {/* New user section */}
        <div className="text-sm text-gray-500 my-4">New to Amazon?</div>

        {/* Create account button */}
        <div className="w-80 text-[12px] font-medium tracking-wide text-center border-[1px] rounded-lg p-[5px] hover:bg-gray-100 mb-7 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500">
          <Link to="/createAccount">
            <div>Create your Amazon account</div>
          </Link>
        </div>
      </div>

      {/* Footer links */}
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

      {/* Copyright notice */}
      <div className="text-xs tracking-wider text-black flex justify-center mt-[4px] pb-16">
        © 1996-2023, Amazon.com, Inc. or its affiliates
      </div>
    </div>
  );
};

// Export the SignIn component as the default export
export default SignIn;

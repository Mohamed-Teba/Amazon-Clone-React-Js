// React and useState for state handling
import React, { useState } from "react";

// Importing constant lists for countries and states
import { countryList, states } from "../../constants/index";

// Loader spinner component for loading state
import { RotatingLines } from "react-loader-spinner";

// Animation library
import { motion } from "framer-motion";

// Firebase functions for reading/writing data
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";


// Redux hook to get user info from global state
import { useSelector } from "react-redux";

// Custom context hook to manage address state
import { useAddress } from "../../context/userAddressContext";

const AddressForm = ({ setShowAddressForm }) => {
  // Getting user data from redux state
  const userInfo = useSelector((state) => state.amazon.userInfo);

  // Function to update address from context
  const { updateUserAddress } = useAddress();

  // Form input states
  const [nameInput, setNameInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [mobileInput, setMobileInput] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [landmarkInput, setLandmarkInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const countryInput = "India"; // Fixed country value


  // Error states for validation
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [cityError, setCityError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [stateError, setStateError] = useState("");

  // Submission states
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Input validation function
  const validate = () => {
    const reqName = /^[A-Za-z\s]+$/;
    const reqCity = /^[A-Za-z\s]+$/;
    const reqMobile = /^[0-9]{10}$/;
    const reqPincode = /^[0-9]{6}$/;
    let isValid = true;

    // Name validation
    if (nameInput === "") {
      setNameError("Please enter a name.");
      isValid = false;
    }
    if (nameInput.length > 0) {
      if (!reqName.test(nameInput)) {
        setNameError("Please enter a valid name.");
        isValid = false;
      }
    }

    // Mobile number validation
    if (mobileInput === "") {
      setMobileError(
        "Please enter a phone number so we can call if there are any issues with delivery."
      );
      isValid = false;
    }
    if (mobileInput.length > 0) {
      if (!reqMobile.test(mobileInput)) {
        setMobileError("Please enter a valid phone number");
        isValid = false;
      }
    }

    // Pincode validation
    if (pincodeInput === "") {
      setPincodeError("Please enter a ZIP or postal code.");
      isValid = false;
    }
    if (pincodeInput.length > 0) {
      if (!reqPincode.test(pincodeInput)) {
        setPincodeError("Please enter a valid ZIP or postal code.");
        isValid = false;
      }
    }

    // City validation
    if (cityInput === "") {
      setCityError("Please enter a city name.");
      isValid = false;
    }
    if (cityInput.length > 0) {
      if (!reqCity.test(cityInput)) {
        setCityError("Please enter a valid city name.");
        isValid = false;
      }
    }

    // Address and state validation
    if (addressInput === "") {
      setAddressError("Please enter an address.");
      isValid = false;
    }

    if (stateInput === "") {
      setStateError("please select your state");
      isValid = false;
    }

    return isValid;
  };

  // Save address to Firebase Firestore
  const saveShippingAddressToFirebase = async (userInfo, shippingAddress) => {
    const addressRef = doc(
      collection(db, "users", userInfo.email, "shippingAddresses"),
      userInfo.id
    );

    try {
      const addressRefSnapshot = await getDoc(addressRef);

      // If no existing address, create new document
      if (!addressRefSnapshot.exists()) {
        await setDoc(
          addressRef,
          { Addresses: [shippingAddress] },
          { merge: true }
        );
        updateUserAddress([shippingAddress]);
        setLoading(false);
        setSuccessMsg("Shipping address saved successfully");
        setShowAddressForm(false);
      } else {
        // Merge with existing addresses
        const firebaseAddresses = addressRefSnapshot.data().Addresses || [];
        const updatedAddresses = [...firebaseAddresses, shippingAddress];
        await setDoc(
          addressRef,
          { Addresses: updatedAddresses },
          { merge: true }
        );
        updateUserAddress(updatedAddresses);
        setLoading(false);
        setSuccessMsg("Shipping address saved successfully");
        setShowAddressForm(false);
      }
    } catch (error) {
      // Handle and display Firebase errors
      setLoading(false);
      setErrorMsg(error.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before saving
    const isValid = validate();
    if (!isValid) {
      return;
    }

    // Prepare address object
    const shippingAddress = {
      name: nameInput,
      mobile: mobileInput,
      address: addressInput,
      area: areaInput,
      landmark: landmarkInput,
      city: cityInput,
      pincode: pincodeInput,
      state: stateInput,
      country: countryInput,
    };

    setLoading(true); // Show loader

    // Save to Firebase
    await saveShippingAddressToFirebase(userInfo, shippingAddress);

    // Clear form fields
    setNameInput("");
    setMobileInput("");
    setAddressInput("");
    setAreaInput("");
    setLandmarkInput("");
    setPincodeInput("");
    setCityInput("");
    setStateInput("");
  };

  return (
    <div>
      <p className="text-lg w-full font-semibold text-red-700">
        1 &nbsp; Enter a new shipping address
      </p>
      <div className="w-full flex justify-end">
        <div className="w-[96%] border-[1px] border-gray-400 rounded-lg mt-1 pl-4 py-3">
          <p className="text-2xl font-semibold">Add new address</p>

          <form
            onSubmit={handleSubmit}
            className="w-[73%] my-4 flex flex-col gap-3"
          >
            <label className="text-sm font-semibold flex flex-col gap-[2px]">
              Full name (First and Last name)
              <input
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setNameError("");
                }}
                value={nameInput}
                type="text"
                autoComplete="true"
                className=" border-[1px] border-[#a6a6a6] rounded p-1 "
              />
              {nameError && (
                <div className="text-sm text-[#d14444]  pl-5">{nameError}</div>
              )}
            </label>
            <label className="text-sm font-semibold flex flex-col gap-[2px]">
              Mobile number
              <input
                onChange={(e) => {
                  setMobileInput(e.target.value);
                  setMobileError("");
                }}
                value={mobileInput}
                type="tel"
                maxLength="10"
                autoComplete="true"
                className=" border-[1px] border-[#a6a6a6] rounded p-1 "
              />
              <p className="text-xs font-normal text-gray-400">
                May be used to assist delivery
              </p>
              {mobileError && (
                <div className="text-sm text-[#d14444]  pl-5">
                  {mobileError}
                </div>
              )}
            </label>
            <label className="text-sm font-semibold flex flex-col gap-[2px]">
              Pincode
              <input
                onChange={(e) => {
                  setPincodeInput(e.target.value);
                  setPincodeError("");
                }}
                value={pincodeInput}
                type="tel"
                maxLength="6"
                autoComplete="true"
                className=" border-[1px] border-[#a6a6a6] rounded p-1 "
              />
              {pincodeError && (
                <div className="text-sm text-[#d14444]  pl-5">
                  {pincodeError}
                </div>
              )}
            </label>
            <label className="text-sm font-semibold flex flex-col gap-[2px]">
              Flat, House no., Building, Company, Apartment
              <input
                onChange={(e) => {
                  setAddressInput(e.target.value);
                  setAddressError("");
                }}
                value={addressInput}
                type="text"
                autoComplete="true"
                className=" border-[1px] border-[#a6a6a6] rounded p-1 "
              />
              {addressError && (
                <div className="text-sm text-[#d14444]  pl-5">
                  {addressError}
                </div>
              )}
            </label>
            <label className="text-sm font-semibold flex flex-col gap-[2px]">
              Area, Street, Sector, Village
              <input
                onChange={(e) => {
                  setAreaInput(e.target.value);
                }}
                value={areaInput}
                type="text"
                autoComplete="true"
                className=" border-[1px] border-[#a6a6a6] rounded p-1 "
              />
            </label>
            <label className="text-sm font-semibold flex flex-col gap-[2px]">
              Landmark
              <input
                onChange={(e) => {
                  setLandmarkInput(e.target.value);
                }}
                value={landmarkInput}
                type="text"
                placeholder="E.g. near apollo hospital"
                autoComplete="true"
                className=" border-[1px] border-[#a6a6a6] rounded p-1 "
              />
            </label>
            <div className="w-full flex flex-row gap-3">
              <label className="text-sm font-semibold w-[50%]">
                Town/City
                <input
                  onChange={(e) => {
                    setCityInput(e.target.value);
                    setCityError("");
                  }}
                  value={cityInput}
                  type="text"
                  autoComplete="true"
                  className="w-full border-[1px] border-[#a6a6a6] rounded p-1 mt-[2px]"
                />
                {cityError && (
                  <div className="text-sm text-[#d14444]  pl-5">
                    {cityError}
                  </div>
                )}
              </label>

              <label className="text-sm font-semibold w-[50%]">
                State
                <select
                  value={stateInput} // Bind the state variable to the value of the select element
                  onChange={(e) => setStateInput(e.target.value)} // Update state when an option is selected
                  type="text"
                  className="w-full border-[1px] border-[#a6a6a6] rounded p-1 mt-[2px]"
                >
                  {states.map((item, index) => (
                    <option
                      value={item}
                      className="hover:bg-blue-500 pl-1 text-sm flex flex-col items-start cursor-pointer"
                      key={index}
                    >
                      {item}
                    </option>
                  ))}
                </select>
                {stateError && (
                  <div className="text-sm text-[#d14444]  pl-5">
                    {stateError}
                  </div>
                )}
              </label>
            </div>
            <label className="text-sm font-semibold flex flex-col gap-[2px]">
              Country
              <select
                defaultValue="India"
                type="text"
                className="w-full border-[1px] border-[#a6a6a6] rounded p-1 shadow-md shadow-slate-400"
              >
                {countryList.map((item, index) => (
                  <option
                    value={item}
                    disabled={item !== "India"} // Pre-select "India" and Disable other options
                    className="hover:bg-blue-500 pl-1 text-sm flex flex-col items-start cursor-pointer"
                    key={index}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <button className="text-sm mdl:w-[50%] text-center rounded-lg bg-yellow-300 hover:bg-yellow-400 p-[6px] mt-5 ml-10 mdl:ml-36 active:ring-2 active:ring-offset-1 active:ring-blue-500">
              Save this address
            </button>
            {loading && (
              <div className="flex justify-center mt-2">
                <RotatingLines
                  strokeColor="#febd69"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={true}
                />
              </div>
            )}
            {successMsg && (
              <div className="">
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 10, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-base font-semibold text-green-600 border-[1px] px-2 text-center"
                >
                  {successMsg}
                </motion.p>
              </div>
            )}
            {errorMsg && (
              <div className="">
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 10, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-base font-semibold text-red-700 border-[1px] px-2 text-center"
                >
                  {errorMsg}
                </motion.p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;





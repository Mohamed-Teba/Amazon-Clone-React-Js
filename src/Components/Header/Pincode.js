import React, { useEffect, useState, useRef } from "react";
import { location, required } from "../../assets/assets/index";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";

const Location = () => {
<<<<<<< HEAD
  // State to track whether the location selector dropdown is visible
  const [selectedLocation, setSelectedLocation] = useState(false);

  // State for the user's entered ZIP code
  const [userZipCode, setUserZipCode] = useState("");

  // State for the resolved location name (city/district)
  const [locationName, setLocationName] = useState(null);

  // Warnings for manual and auto location lookups
  const [warning, setWarning] = useState("");
  const [autoLocationWarning, setAutoLocationWarning] = useState("");

  // Loading flags for manual and auto lookups
  const [loading, setLoading] = useState(false);
  const [autoLocationLoading, setAutoLocationLoading] = useState(false);

  // On mount, load any stored location info from localStorage
  useEffect(() => {
    const storedLocationName = localStorage.getItem("locationName");
    const storedUserZipCode = localStorage.getItem("userZipCode");
    if (storedLocationName && storedUserZipCode) {
      setLocationName(storedLocationName);
      setUserZipCode(storedUserZipCode);
=======
    const [selectedLocation, setSelectedLocation] = useState(false);
    const [userZipCode, setUserZipCode] = useState('');
    const [locationName, setLocationName] = useState(null);
    const [warning, setWarning] = useState("");
    const [autoLocationWarning, setAutoLocationWarning] = useState("")
    const [loading, setLoading] = useState(false);
    const [autoLocationLoading, setAutoLocationLoading] = useState(false);

    useEffect(() => {
        const storedLocationName = localStorage.getItem("locationName");
        const storedUserZipCode = localStorage.getItem("userZipCode");
        if (storedLocationName && storedUserZipCode) {
            setLocationName(storedLocationName);
            setUserZipCode(storedUserZipCode);
        }
    }, []);

    const locationRef = useRef(null);
    useEffect(() => {
        document.body.addEventListener("click", (e) => {
            if (e.target.contains(locationRef.current)) {
                setSelectedLocation(false);
                setWarning(false);
                setAutoLocationWarning(false);
            };
        })
    }, [locationRef])

    async function fetchLocationData(userZipCode) {
        try {
            const response = await axios.get(`https://api.postalpincode.in/pincode/${userZipCode}`);
            if (response.data[0].PostOffice != null) {
                const locationCity = response.data[0].PostOffice[0].District;
                const locationPincode = response.data[0].PostOffice[0].Pincode;
                setLocationName(locationCity);
                setUserZipCode(locationPincode);
                setWarning("");
                setLoading(false);
                setSelectedLocation(false);

                localStorage.setItem("locationName", locationCity);
                localStorage.setItem("userZipCode", locationPincode);
            } else {
                setLoading(false);
                setUserZipCode("");
                setWarning("Location not found");
            }
        } catch (error) {
            setLoading(false);
            setUserZipCode("");
            setWarning(error.message);
        }
>>>>>>> 065d13bc514f0944cfe658bbdfd72108175af39c
    }
  }, []);

<<<<<<< HEAD
  // Ref for the dropdown panel, to detect outside clicks
  const locationRef = useRef(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setSelectedLocation(false);
=======
    const validate = () => {
        const reqPincode = /^[0-9]{6}$/;
        let isValid = true;
        if (userZipCode === "") {
            setWarning("Please enter a ZIP or postal code.");
            isValid = false;
        }
        if (userZipCode.length > 0) {
            if (!reqPincode.test(userZipCode)) {
                setWarning("Please enter a valid ZIP or postal code.");
                isValid = false;
            }
        }
        return isValid
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) {
            return;
        }
        setLoading(true);
        fetchLocationData(userZipCode);
        setUserZipCode("");
    }

    function getLocation() {
>>>>>>> 065d13bc514f0944cfe658bbdfd72108175af39c
        setWarning("");
        setAutoLocationWarning("");
      }
    };
    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch location details by ZIP code via external API
  const fetchLocationData = async (zip) => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${zip}`
      );
      const postOffice = response.data[0].PostOffice;
      if (postOffice != null) {
        const { District: city, Pincode: pcode } = postOffice[0];
        setLocationName(city);
        setUserZipCode(pcode);
        setWarning("");
        setLoading(false);
        setSelectedLocation(false);

        // Persist to localStorage
        localStorage.setItem("locationName", city);
        localStorage.setItem("userZipCode", pcode);
      } else {
        setLoading(false);
        setUserZipCode("");
        setWarning("Location not found");
      }
    } catch (err) {
      setLoading(false);
      setUserZipCode("");
      setWarning(err.message);
    }
  };

  // Validate that the ZIP code is exactly 6 digits
  const validate = () => {
    const reqPincode = /^[0-9]{6}$/;
    if (!userZipCode) {
      setWarning("Please enter a ZIP or postal code.");
      return false;
    }
    if (!reqPincode.test(userZipCode)) {
      setWarning("Please enter a valid ZIP or postal code.");
      return false;
    }
    return true;
  };

  // Handle manual ZIP code submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await fetchLocationData(userZipCode);
    setUserZipCode("");
  };

  // Auto-detect location using browser geolocation + external geonames API
  const getLocation = () => {
    setWarning("");
    setAutoLocationWarning("");
    setAutoLocationLoading(true);

    if (!navigator.geolocation) {
      setAutoLocationLoading(false);
      setAutoLocationWarning("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://secure.geonames.org/findNearbyPostalCodesJSON?lat=${latitude}&lng=${longitude}&username=yadavravi1610`
          );
          const codes = response.data.postalCodes;
          if (codes && codes.length > 0) {
            const { postalCode: pcode, placeName: city } = codes[0];
            setLocationName(city);
            setUserZipCode(pcode);
            setAutoLocationLoading(false);
            setSelectedLocation(false);

<<<<<<< HEAD
            // Persist to localStorage
            localStorage.setItem("locationName", city);
            localStorage.setItem("userZipCode", pcode);
          } else {
            setAutoLocationLoading(false);
            setAutoLocationWarning("Location not found");
          }
        } catch (err) {
          setAutoLocationLoading(false);
          setAutoLocationWarning(err.message);
        }
      },
      (error) => {
        setAutoLocationLoading(false);
        setAutoLocationWarning(error.message);
      }
    );
  };

  return (
    <div>
      {/* Trigger to open/close location selector */}
      <div
        className="headerHover"
        onClick={() => setSelectedLocation(!selectedLocation)}
      >
        <img src={location} className="w-6 h-5 mt-1" alt="location icon" />
        <div className="text-xs text-lightText font-medium flex flex-col items-start">
          {locationName ? "Deliver to" : "Hello"}
          <span className="text-sm font-bold -mt-1 text-whiteText">
            {locationName ? (
              <p>
                {locationName} {userZipCode}
              </p>
            ) : (
              "Select your address"
            )}
          </span>
        </div>
      </div>

      {/* Overlay panel for manual and auto location input */}
      {selectedLocation && (
        <div className="w-screen h-screen fixed z-50 top-0 left-0 bg-amazon_black bg-opacity-50 flex items-center justify-center">
          <div ref={locationRef} className="w-[320px] bg-white rounded-lg">
            {/* Header */}
            <div className="rounded-t-lg bg-gray-100 border-b border-gray-200 p-4 font-bold">
              Choose your location
            </div>

            {/* Manual entry form */}
            <form className="p-4 flex flex-col gap-5" onSubmit={handleSubmit}>
              <p className="text-xs text-gray-400">
                Enter an Indian pincode to see product availability and delivery
                options for your location.
              </p>
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit ZIP code"
                  className="w-[65%] border border-[#a6a6a6] rounded p-1 font-medium"
                  onChange={(e) => {
                    setUserZipCode(e.target.value);
                    setWarning("");
                    setAutoLocationWarning("");
                  }}
                />
                <button className="w-[33%] ml-2 p-2 text-center font-medium rounded-md bg-gray-200 border border-gray-300 hover:bg-gray-300 active:ring-2 active:ring-offset-1 active:ring-blue-500">
                  Apply
                </button>
              </div>
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
            </form>

            {/* Manual warning */}
            {warning && (
              <div className="flex items-center gap-1 pl-4 -mt-3 pb-2">
                <img src={required} className="w-4 h-4" alt="warning" />
                <span className="text-xs text-red-700">{warning}</span>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center justify-between px-4">
              <hr className="w-[45%]" />
              <p className="text-sm font-semibold">or</p>
              <hr className="w-[45%]" />
            </div>

            {/* Auto-detect button */}
            <div
              onClick={getLocation}
              className="m-4 p-2 text-center font-medium rounded-md bg-gray-200 border border-gray-300 cursor-pointer hover:bg-gray-300 active:ring-2 active:ring-offset-1 active:ring-blue-500"
            >
              <p>Auto detect your location</p>
            </div>

            {/* Auto-detect loading */}
            {autoLocationLoading && (
              <div className="flex justify-center mt-2 pb-3">
                <RotatingLines
                  strokeColor="#febd69"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={true}
                />
              </div>
            )}

            {/* Auto-detect warning */}
            {autoLocationWarning && (
              <div className="flex items-center gap-1 pl-4 -mt-3 pb-2">
                <img src={required} className="w-4 h-4" alt="warning" />
                <span className="text-xs text-red-700">
                  {autoLocationWarning}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;
=======
export default Location

>>>>>>> 065d13bc514f0944cfe658bbdfd72108175af39c

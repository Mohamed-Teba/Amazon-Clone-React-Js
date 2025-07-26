// Import React hooks for state management and side effects
import React, { useState, useRef, useEffect } from "react";
// Import React Router hooks for navigation and data loading
import {
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  Link,
} from "react-router-dom";
// Import star icon for rating display
import { star } from "../../assets/index";
// Import Product component for individual product display
import Product from "./Product";
// Import framer-motion for animations
import { motion } from "framer-motion";
// Import useParams for accessing URL parameters
import { useParams } from "react-router-dom";
// Import close icon for mobile filter modal
import CloseIcon from "@mui/icons-material/Close";

// Products component - Main products listing page with filtering and sorting
const Products = () => {
  // Navigation function for programmatic routing
  const navigate = useNavigate();

  // Reference for mobile filter modal
  const ref = useRef();

  // Handle category navigation
  const handleCategoryClick = (category) => {
    navigate(`/${category}`);
  };

  // Get product data from route loader
  const data = useLoaderData();
  const productsData = data.data.products;

  // Get category from URL parameters
  const { category } = useParams();
  // Filter products by category if specified, otherwise show all products
  const categoryProducts = category
    ? productsData.filter((product) => product.category === category)
    : productsData;

  // Extract unique categories for filter options
  const uniqueCategories = Array.from(
    new Set(productsData.map((product) => product.category))
  );

  // State for filter and sorting options
  const [priceRange, setPriceRange] = useState("");
  const [starRange, setStarRange] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  // Handle price filter selection
  const handlePriceFilter = (selectedRange) => {
    if (priceRange === selectedRange) {
      setPriceRange(""); // Toggle off if already selected
    } else {
      setPriceRange(selectedRange);
    }
  };

  // Apply price filtering to products
  const priceFilteredProducts = priceRange
    ? categoryProducts.filter((product) => {
        const [min, max] = priceRange
          .split(" - ")
          .map((str) => parseFloat(str.replace(/[^0-9.-]+/g, "")));
        return product.price >= min && product.price <= max;
      })
    : categoryProducts;

  // Handle star rating filter selection
  const handleStarFilter = (selectedRating) => {
    if (starRange === selectedRating) {
      setStarRange(""); // Toggle off if already selected
    } else {
      setStarRange(selectedRating);
    }
  };

  // Apply star rating filtering to products
  const starFilteredProducts = starRange
    ? priceFilteredProducts.filter(
        (product) => product.rating >= parseFloat(starRange)
      )
    : priceFilteredProducts;

  // Handle sorting option changes
  const handleSortingChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Apply sorting to filtered products
  let sortedProducts = [...starFilteredProducts];
  if (sortOrder === "lowToHigh") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === "avgReview") {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  // State for mobile filter modal visibility
  const [filter, setFilter] = useState(false);

  // Effect for handling clicks outside mobile filter modal
  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (e.target.contains(ref.current)) {
        setFilter(false);
      }
    });
  }, [ref, filter]);

  // Return the products page layout
  return (
    <div className="w-full relative my-6 flex flex-col mdl:flex-row bg-white">
      {/* Mobile filter button */}
      <div className="w-full border-b-2 mdl:hidden">
        <button
          className="xs:block mdl:hidden ml-10 text-lg py-2 text-blue-400"
          onClick={() => setFilter(!filter)}
        >
          Filters
        </button>
      </div>

      {/* Mobile filter modal */}
      {filter && (
        <div className="w-full h-screen mdl:hidden text-black fixed top-[13.3%] sml:top-[14.3%] left-0 border-none bg-opacity-50 z-40">
          <motion.div
            ref={ref}
            initial={{ y: 1000, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full  h-full bg-white border justify-around border-black"
          >
            <div className="flex flex-row">
              {/* Price filter section */}
              <div className="flex flex-col">
                <div className="px-5 py-[10px] text-sm">
                  <p className="text-[15px] underline font-bold mb-1">Price</p>
                  {/* Price range options */}
                  <p
                    className={`font-medium mb-[1px] cursor-pointer ${
                      priceRange === "0 - 10" ? "text-blue-500" : ""
                    }`}
                    onClick={() => handlePriceFilter("0 - 10")}
                  >
                    {" "}
                    Under ₹10
                  </p>
                  <p
                    className={`font-medium mb-[1px] cursor-pointer ${
                      priceRange === "10 - 100" ? "text-blue-500" : ""
                    }`}
                    onClick={() => handlePriceFilter("10 - 100")}
                  >
                    ₹10 - ₹100
                  </p>
                  <p
                    className={`font-medium mb-[1px] cursor-pointer ${
                      priceRange === "100 - 500" ? "text-blue-500" : ""
                    }`}
                    onClick={() => handlePriceFilter("100 - 500")}
                  >
                    ₹100 - ₹500
                  </p>
                  <p
                    className={`font-medium mb-[1px] cursor-pointer ${
                      priceRange === "500 - 1,000" ? "text-blue-500" : ""
                    }`}
                    onClick={() => handlePriceFilter("500 - 1,000")}
                  >
                    ₹500 - ₹1,000
                  </p>
                  <p
                    className={`font-medium mb-[1px] cursor-pointer ${
                      priceRange === "1,000 - 100,000,000"
                        ? "text-blue-500"
                        : ""
                    }`}
                    onClick={() => handlePriceFilter("1,000 - 100,000,000")}
                  >
                    Over ₹1,000
                  </p>
                </div>

                {/* Star rating filter section */}
                <div className="px-5 py-[10px] text-sm">
                  <p className="text-[15px] underline font-bold mb-1">
                    Avg. Customer Review
                  </p>
                  {/* Star rating options */}
                  <div
                    className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${
                      starRange === "4.5" ? "text-blue-500" : ""
                    }`}
                    onClick={() => handleStarFilter("4.5")}
                  >
                    <p>4.5&nbsp; </p>
                    <img src={star} alt="star" className="w-4 h-4" />{" "}
                    <p>&nbsp;and Up</p>
                  </div>
                  <div
                    className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${
                      starRange === "4" ? "text-blue-500" : ""
                    }`}
                    onClick={() => handleStarFilter("4")}
                  >
                    <p>4&nbsp; </p>
                    <img src={star} alt="star" className="w-4 h-4" />{" "}
                    <p>&nbsp;and Up</p>
                  </div>
                  <div
                    className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${
                      starRange === "3" ? "text-blue-500" : ""
                    }`}
                    onClick={() => handleStarFilter("3")}
                  >
                    <p>3&nbsp; </p>
                    <img src={star} alt="star" className="w-4 h-4" />{" "}
                    <p>&nbsp;and Up</p>
                  </div>
                  <div
                    className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${
                      starRange === "2" ? "text-blue-500" : ""
                    }`}
                    onClick={() => handleStarFilter("2")}
                  >
                    <p>2&nbsp; </p>
                    <img src={star} alt="star" className="w-4 h-4" />{" "}
                    <p>&nbsp;and Up</p>
                  </div>
                  <div
                    className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${
                      starRange === "1" ? "text-blue-500" : ""
                    }`}
                    onClick={() => handleStarFilter("1")}
                  >
                    <p>1&nbsp; </p>
                    <img src={star} alt="star" className="w-4 h-4" />{" "}
                    <p>&nbsp;and Up</p>
                  </div>
                </div>
              </div>

              {/* Category filter section */}
              <div className="px-16 py-[10px] text-sm">
                <p className="text-[15px] underline font-bold mb-1">Category</p>
                <Link to="/allProducts">
                  <div
                    className={`font-medium mb-[1px] cursor-pointer ${
                      !category ? "text-blue-500" : ""
                    }`}
                  >
                    All
                  </div>
                </Link>
                {/* Dynamic category options */}
                {uniqueCategories.map((item) => (
                  <div
                    key={item}
                    className={`font-medium mb-[1px] cursor-pointer capitalize ${
                      category === item ? "text-blue-500" : ""
                    }`}
                    onClick={() => handleCategoryClick(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Close button for mobile modal */}
              <div
                onClick={() => setFilter(false)}
                className="w-10 top-1 absolute cursor-pointer h-10 left-[90%] text-black flex items-center justify-center hover:bg-red-500 hover:text-white duration-300 z-50"
              >
                <CloseIcon />
              </div>
            </div>
            {/* Apply changes button */}
            <button className="h-8 text-sm my-4 w-80 sml:w-96 ml-[8%] sml:ml-[10%] text-center rounded-lg bg-yellow-300 hover:bg-yellow-400 p-[6px]">
              Apply Changes
            </button>
          </motion.div>
        </div>
      )}

      {/* Desktop sidebar filters */}
      <div className="w-[18%] xs:hidden mdl:block bg-white border-b-2 mdl:border-r-2 ">
        {/* Price filter section */}
        <div className="px-5 py-[10px]">
          <div>
            <p className="text-[18px] underline font-bold mb-1">Price</p>
          </div>
          <div className="flex flex-row flex-wrap mdl:flex-col xs:text-xs sm:text-sm mdl:text-base sm:gap-5 md:gap-8 mdl:gap-0">
            {/* Price range options */}
            <p
              className={`font-medium mb-[1px] cursor-pointer ${
                priceRange === "0 - 10" ? "text-blue-500" : ""
              }`}
              onClick={() => handlePriceFilter("0 - 10")}
            >
              {" "}
              Under ₹10
            </p>
            <p
              className={`font-medium mb-[1px] cursor-pointer ${
                priceRange === "10 - 100" ? "text-blue-500" : ""
              }`}
              onClick={() => handlePriceFilter("10 - 100")}
            >
              ₹10 - ₹100
            </p>
            <p
              className={`font-medium mb-[1px] cursor-pointer ${
                priceRange === "100 - 500" ? "text-blue-500" : ""
              }`}
              onClick={() => handlePriceFilter("100 - 500")}
            >
              ₹100 - ₹500
            </p>
            <p
              className={`font-medium mb-[1px] cursor-pointer ${
                priceRange === "500 - 1,000" ? "text-blue-500" : ""
              }`}
              onClick={() => handlePriceFilter("500 - 1,000")}
            >
              ₹500 - ₹1,000
            </p>
            <p
              className={`font-medium mb-[1px] cursor-pointer ${
                priceRange === "1,000 - 100,000,000" ? "text-blue-500" : ""
              }`}
              onClick={() => handlePriceFilter("1,000 - 100,000,000")}
            >
              Over ₹1,000
            </p>
          </div>
        </div>

        {/* Star rating filter section */}
        <div className="px-5 py-[10px]">
          <div>
            <p className="text-[18px] underline font-bold mb-1">
              Avg. Customer Review
            </p>
          </div>
          <div className="flex flex-row flex-wrap mdl:flex-col xs:text-xs sml:text-sm mdl:text-base sm:gap-5 md:gap-8 mdl:gap-0">
            {/* Star rating options */}
            <div
              className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${
                starRange === "4.5" ? "text-blue-500" : ""
              }`}
              onClick={() => handleStarFilter("4.5")}
            >
              <p>4.5&nbsp; </p>
              <img src={star} alt="star" className="w-4 h-4" />{" "}
              <p>&nbsp;and Up</p>
            </div>
            <div
              className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${
                starRange === "4" ? "text-blue-500" : ""
              }`}
              onClick={() => handleStarFilter("4")}
            >
              <p>4&nbsp; </p>
              <img src={star} alt="star" className="w-4 h-4" />{" "}
              <p>&nbsp;and Up</p>
            </div>
            <div
              className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${
                starRange === "3" ? "text-blue-500" : ""
              }`}
              onClick={() => handleStarFilter("3")}
            >
              <p>3&nbsp; </p>
              <img src={star} alt="star" className="w-4 h-4" />{" "}
              <p>&nbsp;and Up</p>
            </div>
            <div
              className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${
                starRange === "2" ? "text-blue-500" : ""
              }`}
              onClick={() => handleStarFilter("2")}
            >
              <p>2&nbsp; </p>
              <img src={star} alt="star" className="w-4 h-4" />{" "}
              <p>&nbsp;and Up</p>
            </div>
            <div
              className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${
                starRange === "1" ? "text-blue-500" : ""
              }`}
              onClick={() => handleStarFilter("1")}
            >
              <p>1&nbsp; </p>
              <img src={star} alt="star" className="w-4 h-4" />{" "}
              <p>&nbsp;and Up</p>
            </div>
          </div>
        </div>

        {/* Category filter section */}
        <div className="px-5 py-[10px] ">
          <div>
            <p className="text-[18px] underline font-bold mb-1">Category</p>
          </div>
          <div className="flex flex-row flex-wrap mdl:flex-col xs:text-xs sml:text-sm mdl:text-base sm:gap-5 md:gap-8 mdl:gap-0">
            <Link to="/allProducts">
              <div
                className={`font-medium mb-[1px] cursor-pointer ${
                  !category ? "text-blue-500" : ""
                }`}
              >
                All
              </div>
            </Link>
            {/* Dynamic category options */}
            {uniqueCategories.map((item) => (
              <div
                key={item}
                className={`font-medium mb-[1px] cursor-pointer capitalize ${
                  category === item ? "text-blue-500" : ""
                }`}
                onClick={() => handleCategoryClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main products display area */}
      <div className="w-[82%] bg-white mx-auto">
        {/* Header with results count and sorting options */}
        <div className=" flex items-center justify-between xs:text-sm mdl:text-lg xs:mx-0 mdl:mx-7 mt-2 text-[18px] font-bold">
          <h1>Results </h1>
          {/* Sorting dropdown */}
          <select onChange={handleSortingChange} value={sortOrder}>
            <option value="default">Default Sorting</option>
            <option value="lowToHigh">Price : Low to High</option>
            <option value="highToLow">Price : High to Low</option>
            <option value="avgReview">Avg. Customer Review</option>
          </select>
          <h1>Total : {sortedProducts.length}</h1>
        </div>

        {/* Products grid */}
        <div className="w-full flex flex-wrap justify-evenly ">
          <Product productsData={sortedProducts} />
        </div>
      </div>

      {/* Scroll restoration for navigation */}
      <ScrollRestoration />
    </div>
  );
};

// Export the Products component as the default export
export default Products;

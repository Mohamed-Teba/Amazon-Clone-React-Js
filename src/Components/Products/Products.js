
import { useState, useRef, useEffect } from 'react';
import { ScrollRestoration, useLoaderData, useNavigate, Link } from 'react-router-dom';
import { star } from "../../assets/index";
// Reusable Product card component
import Product from "./Product";
// Animation library for filter panel
import { motion } from "framer-motion";
// Close icon for modal
import CloseIcon from "@mui/icons-material/Close";

/**
 * Products component
 * Renders list of products with filtering, sorting, and category navigation.
 */
const Products = () => {
  // React Router navigation hook
  const navigate = useNavigate();
  // Reference for filter panel click detection
  const ref = useRef();

  /**
   * handleCategoryClick
   * Navigate to route for selected product category
   */
  const handleCategoryClick = (category) => {
    navigate(`/${category}`);
  };

  const { data } = useLoaderData();
  const productsData = data.products;

  // Get current category from URL params
  const { category } = useParams();


  const categoryProducts = category ? productsData.filter((product) => product.category.toLowerCase() === category.toLowerCase()) : productsData;

  // Extract unique categories for sidebar
  const uniqueCategories = Array.from(
    new Set(productsData.map((product) => product.category))
  );

  // State for price filter, star filter, and sort order
  const [priceRange, setPriceRange] = useState("");
  const [starRange, setStarRange] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  /**
   * handlePriceFilter
   * Toggle price range filter on/off
   */
  const handlePriceFilter = (selectedRange) => {
    setPriceRange(priceRange === selectedRange ? "" : selectedRange);
  };

  // Apply price filter to categoryProducts
  const priceFilteredProducts = priceRange
    ? categoryProducts.filter((product) => {
        // Parse numeric range from string like "100 - 500"
        const [min, max] = priceRange
          .split(" - ")
          .map((str) => parseFloat(str.replace(/[^0-9.-]+/g, "")));
        return product.price >= min && product.price <= max;
      })
    : categoryProducts;

  /**
   * handleStarFilter
   * Toggle minimum rating filter on/off
   */
  const handleStarFilter = (selectedRating) => {
    setStarRange(starRange === selectedRating ? "" : selectedRating);
  };

  // Apply star filter to priceFilteredProducts
  const starFilteredProducts = starRange
    ? priceFilteredProducts.filter(
        (product) => product.rating >= parseFloat(starRange)
      )
    : priceFilteredProducts;

  /**
   * handleSortingChange
   * Update sortOrder state based on dropdown selection
   */
  const handleSortingChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Clone array for sorting operations
  let sortedProducts = [...starFilteredProducts];
  if (sortOrder === "lowToHigh") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === "avgReview") {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  // State to control mobile filter panel visibility
  const [filter, setFilter] = useState(false);

  /**
   * Close filter panel when clicking outside
   */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.contains(ref.current)) {
        setFilter(false);
      }
    };
    document.body.addEventListener("click", handleOutsideClick);
    return () => document.body.removeEventListener("click", handleOutsideClick);
  }, [ref]);

  return (
    <div className="w-full relative my-6 flex flex-col mdl:flex-row bg-white">
      {/* Mobile filter toggle button */}
      <div className="w-full border-b-2 mdl:hidden">
        <button
          className="xs:block mdl:hidden ml-10 text-lg py-2 text-blue-400"
          onClick={() => setFilter(!filter)}
        >
          Filters
        </button>
      </div>

      {/* Mobile filter panel */}
      {filter && (
        <div className="w-full h-screen mdl:hidden fixed top-[13.3%] left-0 bg-opacity-50 z-40">
          <motion.div
            ref={ref}
            initial={{ y: 1000, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full bg-white flex justify-around"
          >
            {/* Price and Rating filters in mobile view */}
            <div className="flex">
              {/* Price filter section */}
              <div className="px-5 py-2 text-sm">
                <p className="underline font-bold mb-1">Price</p>
                {[
                  "0 - 10",
                  "10 - 100",
                  "100 - 500",
                  "500 - 1,000",
                  "1,000 - 100,000,000",
                ].map((range) => (
                  <p
                    key={range}
                    className={`font-medium mb-1 cursor-pointer ${
                      priceRange === range ? "text-blue-500" : ""
                    }`}
                    onClick={() => handlePriceFilter(range)}
                  >
                    {range.includes("-") ? `₹${range}` : `Over ₹1,000`}
                  </p>
                ))}
              </div>

              {/* Star rating filter section */}
              <div className="px-5 py-2 text-sm">
                <p className="underline font-bold mb-1">Avg. Customer Review</p>
                {[4.5, 4, 3, 2, 1].map((rating) => (
                  <div
                    key={rating}
                    className={`flex items-center font-medium mt-2 cursor-pointer ${
                      starRange === String(rating) ? "text-blue-500" : ""
                    }`}
                    onClick={() => handleStarFilter(String(rating))}
                  >
                    <p>{rating}&nbsp;</p>
                    <img src={star} alt="star" className="w-4 h-4" />
                    <p>&nbsp;and Up</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category filter section */}
            <div className="px-16 py-2 text-sm">
              <p className="underline font-bold mb-1">Category</p>
              <Link to="/allProducts">
                <div
                  className={`font-medium mb-1 cursor-pointer ${
                    !category ? "text-blue-500" : ""
                  }`}
                >
                  All
                </div>
              </Link>
              {uniqueCategories.map((item) => (
                <div
                  key={item}
                  className={`font-medium mb-1 capitalize cursor-pointer ${
                    category === item ? "text-blue-500" : ""
                  }`}
                  onClick={() => handleCategoryClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Close filter panel button */}
            <div
              onClick={() => setFilter(false)}
              className="absolute top-1 right-4 cursor-pointer"
            >
              <CloseIcon />
            </div>

            {/* Apply filters button */}
            <button className="absolute bottom-10 bg-yellow-300 hover:bg-yellow-400 p-2 rounded-lg">
              Apply Changes
            </button>
          </motion.div>
        </div>
      )}

      {/* Sidebar filters for desktop */}
      <div className="w-[18%] hidden mdl:block bg-white border-r-2">
        <div className="px-5 py-2">
          <p className="underline font-bold mb-1 text-[18px]">Price</p>
          {/* Reuse price filter options */}
          {[
            "0 - 10",
            "10 - 100",
            "100 - 500",
            "500 - 1,000",
            "1,000 - 100,000,000",
          ].map((range) => (
            <p
              key={range}
              className={`font-medium mb-1 cursor-pointer ${
                priceRange === range ? "text-blue-500" : ""
              }`}
              onClick={() => handlePriceFilter(range)}
            >
              {range.includes("-") ? `₹${range}` : `Over ₹1,000`}
            </p>
          ))}
        </div>

        <div className="px-5 py-2">
          <p className="underline font-bold mb-1 text-[18px]">
            Avg. Customer Review
          </p>
          {/* Reuse star rating filter options */}
          {[4.5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              className={`flex items-center font-medium mt-2 cursor-pointer ${
                starRange === String(rating) ? "text-blue-500" : ""
              }`}
              onClick={() => handleStarFilter(String(rating))}
            >
              <p>{rating}&nbsp;</p>
              <img src={star} alt="star" className="w-4 h-4" />
              <p>&nbsp;and Up</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-2">
          <p className="underline font-bold mb-1 text-[18px]">Category</p>
          <Link to="/allProducts">
            <div
              className={`font-medium mb-1 cursor-pointer ${
                !category ? "text-blue-500" : ""
              }`}
            >
              All
            </div>
          </Link>
          {uniqueCategories.map((item) => (
            <div
              key={item}
              className={`font-medium mb-1 capitalize cursor-pointer ${
                category === item ? "text-blue-500" : ""
              }`}
              onClick={() => handleCategoryClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Main content: result count, sorting, and product grid */}
      <div className="w-[82%] mx-auto bg-white">
        <div className="flex items-center justify-between text-[18px] font-bold py-2 mx-7">
          <h1>Results</h1>
          <select onChange={handleSortingChange} value={sortOrder}>
            <option value="default">Default Sorting</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="avgReview">Avg. Customer Review</option>
          </select>
          <h1>Total: {sortedProducts.length}</h1>
        </div>
        <div className="w-full flex flex-wrap justify-evenly">
          {/* Render filtered, sorted products */}
          <Product productsData={sortedProducts} />
        </div>
      </div>

      {/* Restore scroll position on navigation */}
      <ScrollRestoration />
    </div>
  );
};

export default Products;

// Import React hooks for state management and side effects
import React, { useEffect, useState, useCallback } from "react";
// Import useRef for referencing DOM elements
import { useRef } from "react";
// Import Material-UI icons for search and dropdown
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// Import navigation and data loading hooks
import { useNavigate, useLoaderData } from "react-router-dom";

// Search component - Handles product search and category selection
const Search = () => {
  // Ref for the "All Categories" dropdown
  const allCategoryRef = useRef(null);
  // State for showing/hiding the category dropdown
  const [showAll, setShowAll] = useState(false);
  // Ref for the Search dropdown
  const searchRef = useRef(null);
  // State for showing/hiding the search results dropdown
  const [showSearch, setShowSearch] = useState(false);
  // State for search input and results
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]); // To store search results

  // Navigation and product data
  const navigate = useNavigate();
  const data = useLoaderData();
  const productsData = data.data.products;

  // Extract unique categories for dropdown
  const uniqueCategories = Array.from(
    new Set(productsData.map((product) => product.category))
  );

  // Function to handle search API call
  const handleSearch = useCallback(() => {
    if (searchInput.length > 2) {
      fetch(`https://dummyjson.com/products/search?q=${searchInput}`)
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data.products);
          setShowSearch(true);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  }, [searchInput]);

  // Effect to close the "All Categories or Search" dropdown when clicking outside
  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (
        allCategoryRef.current &&
        !allCategoryRef.current.contains(e.target)
      ) {
        setShowAll(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearchResults([]);
      }
    });
    // fetch results when searchInput.length > 2
    if (searchInput.length > 2) {
      handleSearch();
    }
  }, [
    allCategoryRef,
    showAll,
    searchRef,
    showSearch,
    searchInput,
    handleSearch,
  ]);

  // Render the search bar and dropdowns
  return (
    <div className="h-10 rounded-sm flex flex-grow relative ml-4 text-black">
      {/* Category dropdown */}
      <span
        onClick={() => setShowAll(!showAll)}
        ref={allCategoryRef}
        className="w-14 pl-2 h-full flex items-center justify-center text-xs text-amazon_black cursor-pointer
                      bg-gray-100 hover:bg-gray-300 rounded-tl-md rounded-bl-md duration-300 border-r-[1px] border-gray-300"
      >
        All
        <span>
          <ArrowDropDownIcon />
        </span>
        {showAll && (
          <ul
            className="absolute top-10 left-0 w-48 h-80 ml-[1px] text-black bg-white 
                                border-[1px] border-gray-400 overflow-y-scroll overflow-x-hidden  flex-col 
                                z-50"
          >
            {uniqueCategories.map((category, index) => (
              <li
                className="hover:bg-blue-500 hover:text-white pl-1 text-[#0f1111] text-sm flex flex-col items-start cursor-pointer capitalize"
                onClick={() => navigate(`/${category}`)}
                key={index}
              >
                {category}
              </li>
            ))}
          </ul>
        )}
      </span>
      {/* Search input and results dropdown */}
      <div className="flex flex-col w-full" ref={searchRef}>
        <input
          onClick={() => {
            setShowSearch(true);
          }}
          onChange={(e) => setSearchInput(e.target.value)}
          className=" text-base text-amazon_black flex-grow h-full px-2 border-none outline-none   placeholder:text-[#817e7e] font-[400] py-3"
          type="text"
          placeholder="Search Amazon.in"
          value={searchInput}
        />
        {showSearch && searchInput.length > 2 && (
          <div>
            {searchResults.length === 0 ? (
              <p className="w-[108.5%] pl-2 py-[6px] text-[#0f1111] text-[17px]  bg-white border-[1px] border-gray-400 z-50">
                No results found.
              </p>
            ) : (
              <ul className="w-[108.5%] h-auto max-h-80 text-black bg-white border-[1px] border-gray-400 z-50 custom-scrollbar overflow-y-hidden hover:overflow-y-scroll">
                {searchResults.map((result, index) => (
                  <li
                    className="hover:bg-gray-100 pl-2 py-[6px] text-[#0f1111] text-[17px] font-bold cursor-pointer"
                    key={index}
                    onClick={() => {
                      setSearchInput("");
                      setShowSearch(false);
                      setSearchResults([]);
                      navigate(`/allProducts/${result.title}`);
                    }}
                  >
                    {result.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {/* Search button */}
      <span
        onClick={() => handleSearch()}
        className="w-12 h-full flex items-center justify-center bg-amazon_yellow hover:bg-[#f3a847] text-amazon_black cursor-pointer rounded-tr-md rounded-br-md duration-300"
      >
        <SearchIcon />
      </span>
    </div>
  );
};
// Export the Search component as the default export
export default Search;

import React, { useEffect, useState, useCallback, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate, useLoaderData } from "react-router-dom";

const Search = () => {
  // Ref for the "All Categories" dropdown container
  const allCategoryRef = useRef(null);
  // Control visibility of the "All Categories" dropdown
  const [showAll, setShowAll] = useState(false);

  // Ref for the search results dropdown container
  const searchRef = useRef(null);
  // Control visibility of the search results dropdown
  const [showSearch, setShowSearch] = useState(false);

  // State for the user's current search input
  const [searchInput, setSearchInput] = useState("");
  // Store fetched search results
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();
  const data = useLoaderData();
  const productsData = data.data.products;

  // Derive a list of unique categories for the "All" dropdown
  const uniqueCategories = Array.from(
    new Set(productsData.map((product) => product.category))
  );

  // Memoized search function to fetch matching products
  const handleSearch = useCallback(() => {
    if (searchInput.length > 2) {
      fetch(`https://dummyjson.com/products/search?q=${searchInput}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.products);
          setShowSearch(true);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  }, [searchInput]);

  // Close dropdowns when clicking outside, and trigger search when input length > 2
  useEffect(() => {
    const handleClickOutside = (e) => {
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
    };

    document.body.addEventListener("click", handleClickOutside);
    if (searchInput.length > 2) {
      handleSearch();
    }
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [handleSearch, searchInput]);

  return (
    <div className="h-10 rounded-sm flex flex-grow relative ml-4 text-black">
      {/* All Categories dropdown trigger */}
      <span
        ref={allCategoryRef}
        onClick={() => setShowAll(!showAll)}
        className="w-14 pl-2 h-full flex items-center justify-center text-xs text-amazon_black cursor-pointer bg-gray-100 hover:bg-gray-300 rounded-tl-md rounded-bl-md duration-300 border-r border-gray-300"
      >
        All <ArrowDropDownIcon />
        {showAll && (
          <ul className="absolute top-10 left-0 w-48 h-80 ml-[1px] bg-white border border-gray-400 overflow-y-scroll z-50">
            {uniqueCategories.map((category, idx) => (
              <li
                key={idx}
                className="hover:bg-blue-500 hover:text-white pl-1 text-sm cursor-pointer capitalize"
                onClick={() => {
                  navigate(`/${category}`);
                  setShowAll(false);
                }}
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
          type="text"
          placeholder="Search Amazon.in"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClick={() => setShowSearch(true)}
          className="flex-grow h-full px-2 py-3 border-none outline-none placeholder:text-[#817e7e] text-amazon_black"
        />
        {showSearch && searchInput.length > 2 && (
          <div className="absolute w-full bg-white border border-gray-400 z-50 max-h-80 overflow-y-auto">
            {searchResults.length === 0 ? (
              <p className="p-2 text-sm text-[#0f1111]">No results found.</p>
            ) : (
              <ul>
                {searchResults.map((result, idx) => (
                  <li
                    key={idx}
                    className="hover:bg-gray-100 p-2 text-sm font-bold cursor-pointer"
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
        onClick={handleSearch}
        className="w-12 h-full flex items-center justify-center bg-amazon_yellow hover:bg-[#f3a847] cursor-pointer rounded-tr-md rounded-br-md duration-300"
      >
        <SearchIcon />
      </span>
    </div>
  );
};

export default Search;

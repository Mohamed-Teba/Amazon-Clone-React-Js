import React, { useState, useRef, useEffect } from 'react';
import { ScrollRestoration, useLoaderData, useNavigate, Link } from 'react-router-dom';
import { star } from "../../assets/index";
import Product from './Product';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const Products = () => {
  const navigate = useNavigate();

  const ref = useRef();
  const handleCategoryClick = (category) => {
    navigate(`/${category}`); 
  };
  const data = useLoaderData();
  const productsData = data.data.products;

  const { category } = useParams();
  const categoryProducts = category ? productsData.filter((product) => product.category === category) : productsData;

  const uniqueCategories = Array.from(new Set(productsData.map(product => product.category)));

  const [priceRange, setPriceRange] = useState("");
  const [starRange, setStarRange] = useState(""); 
  const [sortOrder, setSortOrder] = useState("default"); 


  const handlePriceFilter = (selectedRange) => {
    if (priceRange === selectedRange) {
      setPriceRange("");
    } else {
      setPriceRange(selectedRange);
    }
  };

  const priceFilteredProducts = priceRange
    ? categoryProducts.filter(product => {
      const [min, max] = priceRange.split(" - ").map(str => parseFloat(str.replace(/[^0-9.-]+/g, "")));
      return product.price >= min && product.price <= max;
    })
    : categoryProducts;

  const handleStarFilter = (selectedRating) => {
    if (starRange === selectedRating) {
      setStarRange("");
    } else {
      setStarRange(selectedRating);
    }
  };

  const starFilteredProducts = starRange
    ? priceFilteredProducts.filter(product => product.rating >= parseFloat(starRange))
    : priceFilteredProducts;

  const handleSortingChange = (event) => {
    setSortOrder(event.target.value);
  };

  let sortedProducts = [...starFilteredProducts];
  if (sortOrder === "lowToHigh") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === "avgReview") {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  const [filter, setFilter] = useState(false);
  // console.log(filter);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (e.target.contains(ref.current)) {
        setFilter(false);
      }
    })
  }, [ref, filter])

  return (
    <div className='w-full relative my-6 flex flex-col mdl:flex-row bg-white'>
      <div className='w-full border-b-2 mdl:hidden'>
        <button className='xs:block mdl:hidden ml-10 text-lg py-2 text-blue-400' onClick={() => setFilter(!filter)}>Filters</button>
      </div>
      {
        filter &&
        <div className='w-full h-screen mdl:hidden text-black fixed top-[13.3%] sml:top-[14.3%] left-0 border-none bg-opacity-50 z-40' >
          <motion.div ref={ref} initial={{ y: 1000, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .5 }} className='w-full  h-full bg-white border justify-around border-black'>
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div className='px-5 py-[10px] text-sm'>
                  <p className='text-[15px] underline font-bold mb-1'>Price</p>
                  <p className={`font-medium mb-[1px] cursor-pointer ${priceRange === "0 - 10" ? "text-blue-500" : ""}`}
                    onClick={() => handlePriceFilter("0 - 10")}
                  > Under ₹10
                  </p>
                  <p className={`font-medium mb-[1px] cursor-pointer ${priceRange === "10 - 100" ? "text-blue-500" : ""}`}
                    onClick={() => handlePriceFilter("10 - 100")}
                  >₹10 - ₹100
                  </p>
                  <p className={`font-medium mb-[1px] cursor-pointer ${priceRange === "100 - 500" ? "text-blue-500" : ""}`}
                    onClick={() => handlePriceFilter("100 - 500")}
                  >₹100 - ₹500
                  </p>
                  <p className={`font-medium mb-[1px] cursor-pointer ${priceRange === "500 - 1,000" ? "text-blue-500" : ""}`}
                    onClick={() => handlePriceFilter("500 - 1,000")}
                  >₹500 - ₹1,000
                  </p>
                  <p className={`font-medium mb-[1px] cursor-pointer ${priceRange === "1,000 - 100,000,000" ? "text-blue-500" : ""}`}
                    onClick={() => handlePriceFilter("1,000 - 100,000,000")}>
                    Over ₹1,000
                  </p>
                </div>

                <div className='px-5 py-[10px] text-sm'>
                  <p className='text-[15px] underline font-bold mb-1'>Avg. Customer Review</p>
                  <div className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${starRange === "4.5" ? "text-blue-500" : ""}`}
                    onClick={() => handleStarFilter("4.5")}>
                    <p>4.5&nbsp; </p><img src={star} alt="star" className='w-4 h-4' /> <p>&nbsp;and Up</p>
                  </div>
                  <div className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${starRange === "4" ? "text-blue-500" : ""}`}
                    onClick={() => handleStarFilter("4")}>
                    <p>4&nbsp; </p><img src={star} alt="star" className='w-4 h-4' /> <p>&nbsp;and Up</p>
                  </div>
                  <div className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${starRange === "3" ? "text-blue-500" : ""}`}
                    onClick={() => handleStarFilter("3")}>
                    <p>3&nbsp; </p><img src={star} alt="star" className='w-4 h-4' /> <p>&nbsp;and Up</p>
                  </div>
                  <div className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${starRange === "2" ? "text-blue-500" : ""}`}
                    onClick={() => handleStarFilter("2")}>
                    <p>2&nbsp; </p><img src={star} alt="star" className='w-4 h-4' /> <p>&nbsp;and Up</p>
                  </div>
                  <div className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${starRange === "1" ? "text-blue-500" : ""}`}
                    onClick={() => handleStarFilter("1")}>
                    <p>1&nbsp; </p><img src={star} alt="star" className='w-4 h-4' /> <p>&nbsp;and Up</p>
                  </div>
                </div>
              </div>
              <div className='px-16 py-[10px] text-sm'>
                <p className='text-[15px] underline font-bold mb-1'>Category</p>
                <Link to="/allProducts">
                  <div className={`font-medium mb-[1px] cursor-pointer ${!category ? "text-blue-500" : ""}`}>
                    All
                  </div>
                </Link>
                {uniqueCategories.map((item) => (
                  <div key={item} className={`font-medium mb-[1px] cursor-pointer capitalize ${category === item ? "text-blue-500" : ""}`}
                    onClick={() => handleCategoryClick(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div onClick={() => setFilter(false)} className='w-10 top-1 absolute cursor-pointer h-10 left-[90%] text-black flex items-center justify-center hover:bg-red-500 hover:text-white duration-300 z-50'><CloseIcon />
              </div>

            </div>
            <button className='h-8 text-sm my-4 w-80 sml:w-96 ml-[8%] sml:ml-[10%] text-center rounded-lg bg-yellow-300 hover:bg-yellow-400 p-[6px]'
            >Apply Changes</button>
          </motion.div>

        </div>
      }
      <div className='w-[18%] xs:hidden mdl:block bg-white border-b-2 mdl:border-r-2 '>
        <div className='px-5 py-[10px]'>
          <div><
            p className='text-[18px] underline font-bold mb-1'>Price</p>
          </div>
          <div className='flex flex-row flex-wrap mdl:flex-col xs:text-xs sm:text-sm mdl:text-base sm:gap-5 md:gap-8 mdl:gap-0'>
            <p className={`font-medium mb-[1px] cursor-pointer ${priceRange === "0 - 10" ? "text-blue-500" : ""}`}
              onClick={() => handlePriceFilter("0 - 10")}
            > Under ₹10
            </p>
            <p className={`font-medium mb-[1px] cursor-pointer ${priceRange === "10 - 100" ? "text-blue-500" : ""}`}
              onClick={() => handlePriceFilter("10 - 100")}
            >₹10 - ₹100
            </p>
            <p className={`font-medium mb-[1px] cursor-pointer ${priceRange === "100 - 500" ? "text-blue-500" : ""}`}
              onClick={() => handlePriceFilter("100 - 500")}
            >₹100 - ₹500
            </p>
            <p className={`font-medium mb-[1px] cursor-pointer ${priceRange === "500 - 1,000" ? "text-blue-500" : ""}`}
              onClick={() => handlePriceFilter("500 - 1,000")}
            >₹500 - ₹1,000
            </p>
            <p className={`font-medium mb-[1px] cursor-pointer ${priceRange === "1,000 - 100,000,000" ? "text-blue-500" : ""}`}
              onClick={() => handlePriceFilter("1,000 - 100,000,000")}>
              Over ₹1,000
            </p></div>
        </div>x

        <div className='px-5 py-[10px]'>
          <div>
            <p className='text-[18px] underline font-bold mb-1'>Avg. Customer Review</p>
          </div>
          <div className='flex flex-row flex-wrap mdl:flex-col xs:text-xs sml:text-sm mdl:text-base sm:gap-5 md:gap-8 mdl:gap-0'>
            <div className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${starRange === "4.5" ? "text-blue-500" : ""}`}
              onClick={() => handleStarFilter("4.5")}>
              <p>4.5&nbsp; </p><img src={star} alt="star" className='w-4 h-4' /> <p>&nbsp;and Up</p>
            </div>
            <div className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${starRange === "4" ? "text-blue-500" : ""}`}
              onClick={() => handleStarFilter("4")}>
              <p>4&nbsp; </p><img src={star} alt="star" className='w-4 h-4' /> <p>&nbsp;and Up</p>
            </div>
            <div className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${starRange === "3" ? "text-blue-500" : ""}`}
              onClick={() => handleStarFilter("3")}>
              <p>3&nbsp; </p><img src={star} alt="star" className='w-4 h-4' /> <p>&nbsp;and Up</p>
            </div>
            <div className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${starRange === "2" ? "text-blue-500" : ""}`}
              onClick={() => handleStarFilter("2")}>
              <p>2&nbsp; </p><img src={star} alt="star" className='w-4 h-4' /> <p>&nbsp;and Up</p>
            </div>
            <div className={`flex items-center font-medium mt-2 mb-1 cursor-pointer ${starRange === "1" ? "text-blue-500" : ""}`}
              onClick={() => handleStarFilter("1")}>
              <p>1&nbsp; </p><img src={star} alt="star" className='w-4 h-4' /> <p>&nbsp;and Up</p>
            </div>
          </div>
        </div>

        <div className='px-5 py-[10px] '>
          <div>
            <p className='text-[18px] underline font-bold mb-1'>Category</p>
          </div>
          <div className='flex flex-row flex-wrap mdl:flex-col xs:text-xs sml:text-sm mdl:text-base sm:gap-5 md:gap-8 mdl:gap-0'>
            <Link to="/allProducts">
              <div className={`font-medium mb-[1px] cursor-pointer ${!category ? "text-blue-500" : ""}`}>
                All
              </div>
            </Link>
            {uniqueCategories.map((item) => (
              <div key={item} className={`font-medium mb-[1px] cursor-pointer capitalize ${category === item ? "text-blue-500" : ""}`}
                onClick={() => handleCategoryClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div >

      <div className='w-[82%] bg-white mx-auto'>
        <div className=' flex items-center justify-between xs:text-sm mdl:text-lg xs:mx-0 mdl:mx-7 mt-2 text-[18px] font-bold'>
          <h1>Results </h1>
          <select onChange={handleSortingChange} value={sortOrder}>
            <option value="default">Default Sorting</option>
            <option value="lowToHigh">Price : Low to High</option>
            <option value="highToLow">Price : High to Low</option>
            <option value="avgReview">Avg. Customer Review</option>
          </select>
          <h1>Total : {sortedProducts.length}</h1>
        </div>
        <div className='w-full flex flex-wrap justify-evenly '>
          <Product productsData={sortedProducts} />
        </div>
      </div>
      <ScrollRestoration />
    </div >
  )
}
export default Products;
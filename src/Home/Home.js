// Import React library for component development
import React from "react";
// Import Slider component for banner image carousel
import Slider from "./Slider";
// Import banner images for the slider component
import {
  bannerImgOne,
  bannerImgTwo,
  bannerImgThree,
  bannerImgFour,
  bannerImgFive,
} from "../assets/assets/index";
// Import Category component for product categories display
import Category from "./Category";
// Import ProductsSlider component for featured products
import ProductsSlider from "./productSlider";
// Import ScrollRestoration for maintaining scroll position
import { ScrollRestoration } from "react-router-dom";

// Home component - Main landing page of the application
const Home = () => {
  // Array of banner images for the slider component
  const sampleImage = [
    bannerImgOne,
    bannerImgTwo,
    bannerImgThree,
    bannerImgFour,
    bannerImgFive,
  ];

  // Return the home page layout with all main sections
  return (
    <div>
      {/* Banner slider section with promotional images */}
      <Slider images={sampleImage} />
      {/* Product categories section with negative margin for overlay effect */}
      <div className="sml:-mt-28 mdl:-mt-60">
        <Category />
      </div>
      {/* Featured products slider section */}
      <div>
        <ProductsSlider />
      </div>
      {/* Scroll restoration component for navigation */}
      <ScrollRestoration />
    </div>
  );
};

// Export the Home component as the default export
export default Home;

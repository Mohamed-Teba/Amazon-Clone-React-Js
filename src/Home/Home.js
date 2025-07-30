import React from "react";
// Slider component for rotating banners
import Slider from "./Slider";
// Banner images assets
import {
  bannerImgOne,
  bannerImgTwo,
  bannerImgThree,
  bannerImgFour,
  bannerImgFive,
} from "../assets/assets/index";
// Category grid component
import Category from "./Category";
// Horizontal product carousel component
import ProductsSlider from "./productSlider";
// Restores scroll position on navigation
import { ScrollRestoration } from "react-router-dom";

/**
 * Home component
 * Displays homepage with banner slider, category section,
 * featured products slider, and scroll restoration.
 */
const Home = () => {
  // Array of banner images to pass to Slider
  const sampleImage = [
    bannerImgOne,
    bannerImgTwo,
    bannerImgThree,
    bannerImgFour,
    bannerImgFive,
  ];

  return (
    <div>
      {/* Banner image carousel at top of page */}
      <Slider images={sampleImage} />

      {/* Category grid overlaid below slider */}
      <div className="sml:-mt-28 mdl:-mt-60">
        <Category />
      </div>

      {/* Featured products horizontal slider */}
      <ProductsSlider />

      {/* Ensures scroll position persists when navigating away and back */}
      <ScrollRestoration />
    </div>
  );
};

export default Home;

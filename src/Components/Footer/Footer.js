// Import React library for component development
import React from "react";
// Import FooterTop component for the top section of footer
import FooterTop from "./FooterTop";
// Import FooterMiddle component for the middle section of footer
import FooterMiddle from "./FooterMiddle";
// Import FooterBottom component for the bottom section of footer
import FooterBottom from "./FooterBottom";

// Footer component - Main footer container that includes all footer sections
const Footer = () => {
  return (
    <div>
      {/* Top footer section with newsletter signup and social links */}
      <FooterTop />
      {/* Middle footer section with navigation links and categories */}
      <FooterMiddle />
      {/* Bottom footer section with copyright and legal links */}
      <FooterBottom />
    </div>
  );
};

// Export the Footer component as the default export
export default Footer;

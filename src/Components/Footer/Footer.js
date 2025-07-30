import React from "react";
// Importing subcomponents that make up different parts of the footer
import FooterTop from "./FooterTop";
import FooterMiddle from "./FooterMiddle";
import FooterBottom from "./FooterBottom";

const Footer = () => {
  return (
    <div>
      {/* Top section of the footer (e.g., newsletter, quick links, etc.) */}
      <FooterTop />

      {/* Middle section of the footer (e.g., detailed links or company info) */}
      <FooterMiddle />

      {/* Bottom section of the footer (e.g., copyright info) */}
      <FooterBottom />
    </div>
  );
};


export default Footer;

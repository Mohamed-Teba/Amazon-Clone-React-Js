// Import React library for component development
import React from "react";
// Import useEffect hook for side effects
import { useEffect } from "react";
// Import useNavigate hook for programmatic navigation
import { useNavigate } from "react-router-dom";

// ErrorPage component - Displays error message and automatically redirects to previous page
const ErrorPage = () => {
  // Navigation function for programmatic routing
  const navigate = useNavigate();

  // Effect to automatically redirect to previous page after 3 seconds
  useEffect(() => setTimeout(() => navigate(-1), 3000));

  // Return the error page layout
  return (
    <div>
      {/* Error message with automatic redirect notification */}
      <h1 className="">
        OOPS!! Something went wrong. You will be re-directed to previous page in
        3-seconds.
      </h1>
    </div>
  );
};

// Export the ErrorPage component as the default export
export default ErrorPage;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  // Hook to navigate programmatically (go back, forward, or to specific routes)
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timeout to navigate back to the previous page after 3 seconds
    const timer = setTimeout(() => navigate(-1), 3000);

    // Clear the timeout when the component unmounts to prevent memory leaks
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-100 px-4">
      <h1 className="text-xl font-semibold text-red-800 text-center">
        OOPS!! Something went wrong.
        <br />
        You will be re-directed to the previous page in 3 seconds.
      </h1>
    </div>
  );
};

export default ErrorPage;

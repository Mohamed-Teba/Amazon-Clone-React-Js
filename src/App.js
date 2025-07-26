// Import Footer component for the bottom section of the application
import Footer from "./Components/Footer/Footer";
// Import Header component for the top navigation bar
import Header from "./Components/Header/Header";
// Import HeaderBottom component for secondary navigation
import HeaderBottom from "./Components/Header/HeaderBottom";
// Import ErrorPage component for handling routing errors
import ErrorPage from "./Components/Error/Error";
// Import React Router components for navigation and routing
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
// Import products data loader function
import { productsData } from "./api/api";
// Import Home page component
import Home from "./Home/Home";
// Import Login component for user authentication
import Login from "./Components/Login/Login";
// Import SignUp component for user registration
import SignUp from "./Components/Login/SignUp";
// Import Cart component for shopping cart functionality
import Cart from "./Components/Cart/Cart";
// Import Orders component for order management
import Orders from "./Components/Orders/Orders";
// Import Products component for product listing
import Products from "./Components/Products/Products";
// Import ProductDetails component for individual product pages
import ProductDetails from "./Components/Products/productDetails";
// Import UserCartProvider context for cart state management
import { UserCartProvider } from "./context/userCartContext";
// Import UserAddressProvider context for address management
import { UserAddressProvider } from "./context/userAddressContext";
// Import Checkout component for payment processing
import Checkout from "./Components/Checkout/Checkout";
// Import ForgotPassword component for password recovery
import ForgotPassword from "./Components/Login/ForgotPassword";
// Import UserOrdersProvider context for order state management
import { UserOrdersProvider } from "./context/userOrderContext";

// Layout component that wraps all pages with common header and footer
const Layout = () => {
  return (
    <>
      {/* Main header navigation bar */}
      <Header />
      {/* Secondary header with additional navigation options */}
      <HeaderBottom />
      {/* Scroll restoration for maintaining scroll position on navigation */}
      <ScrollRestoration />
      {/* Outlet for rendering child routes */}
      <Outlet />
      {/* Footer section with links and information */}
      <Footer />
    </>
  );
};

// Main App component that sets up routing and context providers
function App() {
  // Create browser router with all application routes
  const router = createBrowserRouter([
    {
      // Root path that uses the Layout component
      path: "/",
      element: <Layout />,
      // Load products data for all routes under this path
      loader: productsData,
      // Error page to display when routing errors occur
      errorElement: <ErrorPage />,
      // Child routes that will be rendered inside the Layout
      children: [
        {
          // Home page route (index route)
          index: true,
          loader: productsData,
          element: <Home />,
        },
        {
          // All products page route
          path: "/allProducts",
          loader: productsData,
          children: [
            {
              // Products listing page
              index: true,
              loader: productsData,
              element: <Products />,
            },
            {
              // Individual product details page
              path: ":title",
              loader: productsData,
              element: <ProductDetails />,
            },
          ],
        },
        {
          // Category-based product routes
          path: ":category",
          children: [
            {
              // Products filtered by category
              index: true,
              loader: productsData,
              element: <Products />,
            },
            {
              // Product details within a category
              path: ":title",
              loader: productsData,
              element: <ProductDetails />,
            },
          ],
        },
        {
          // Shopping cart page route
          path: "/Cart",
          loader: productsData,
          element: <Cart />,
        },
        {
          // User orders page route
          path: "/orders",
          loader: productsData,
          element: <Orders />,
        },
      ],
    },
    {
      // Authentication routes (outside main layout)
      path: "/Login",
      children: [
        {
          // Login page
          index: true,
          element: <Login />,
        },
        {
          // Forgot password page
          path: "forgotPassword",
          element: <ForgotPassword />,
        },
      ],
    },

    {
      // User registration page route
      path: "/createAccount",
      element: <SignUp />,
    },
    {
      // Checkout page route for payment processing
      path: "/checkout",
      element: <Checkout />,
    },
  ]);

  // Return the app wrapped in context providers for state management
  return (
    // UserOrdersProvider for managing order-related state
    <UserOrdersProvider>
      {/* UserCartProvider for managing shopping cart state */}
      <UserCartProvider>
        {/* UserAddressProvider for managing user address information */}
        <UserAddressProvider>
          {/* Main container with horizontal scroll prevention */}
          <div className="overflow-x-hidden">
            {/* Router provider that handles all routing logic */}
            <RouterProvider router={router} />
          </div>
        </UserAddressProvider>
      </UserCartProvider>
    </UserOrdersProvider>
  );
}

// Export the App component as the default export
export default App;

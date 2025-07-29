import React from "react";
// Core layout components
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import HeaderBottom from "./Components/Header/HeaderBottom";
import ErrorPage from "./Components/Error/Error";

// React Router utilities for routing and scroll restoration
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";

// Data loader for product data
import { productsData } from "./api/api";

// Page components
import Home from "./Home/Home";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import Cart from "./Components/Cart/Cart";
import Orders from "./Components/Orders/Orders";
import Products from "./Components/Products/Products";
import ProductDetails from "./Components/Products/productDetails";
import Checkout from "./Components/Checkout/Checkout";
import ForgotPassword from "./Components/Login/ForgotPassword";

// Context providers for cart, address, and orders
import { UserCartProvider } from "./context/userCartContext";
import { UserAddressProvider } from "./context/userAddressContext";
import { UserOrdersProvider } from "./context/userOrderContext";

/**
 * Layout component
 * Renders common header, footer, and scroll restoration for all pages
 */
const Layout = () => (
  <>
    <Header />
    <HeaderBottom />
    {/* Restores scroll position on navigation */}
    <ScrollRestoration />
    {/* Render matched child routes here */}
    <Outlet />
    <Footer />
  </>
);

/**
 * App component
 * Configures routing and wraps application in context providers
 */
function App() {
  // Define application routes using React Router v6 createBrowserRouter
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Root layout for nested routes
      loader: productsData, // Load product data for layout
      errorElement: <ErrorPage />, // Fallback for routing errors
      children: [
        // Nested routes under root
        {
          index: true,
          loader: productsData,
          element: <Home />, // Homepage at '/'
        },
        {
          path: "/allProducts", // Products listing base path
          loader: productsData,
          children: [
            // Nested under '/allProducts'
            {
              index: true,
              loader: productsData,
              element: <Products />, // '/allProducts'
            },
            {
              path: ":title", // '/allProducts/:title'
              loader: productsData,
              element: <ProductDetails />,
            },
          ],
        },
        {
          path: ":category", // Dynamic category pages at '/:category'
          children: [
            {
              index: true,
              loader: productsData,
              element: <Products />, // '/electronics', '/fashion', etc.
            },
            {
              path: ":title", // '/:category/:title'
              loader: productsData,
              element: <ProductDetails />,
            },
          ],
        },
        {
          path: "/Cart",
          loader: productsData,
          element: <Cart />, // Shopping cart page
        },
        {
          path: "/orders",
          loader: productsData,
          element: <Orders />, // Orders history page
        },
      ],
    },
    {
      path: "/Login", // Authentication routes
      children: [
        { index: true, element: <Login /> },
        { path: "forgotPassword", element: <ForgotPassword /> },
      ],
    },
    { path: "/createAccount", element: <SignUp /> },
    { path: "/checkout", element: <Checkout /> },
  ]);

  return (
    // Wrap app in Providers to supply global state via Context
    <UserOrdersProvider>
      <UserCartProvider>
        <UserAddressProvider>
          <div className="overflow-x-hidden">
            {/* Render routes configured above */}
            <RouterProvider router={router} />
          </div>
        </UserAddressProvider>
      </UserCartProvider>
    </UserOrdersProvider>
  );
}

export default App;

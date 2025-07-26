// Import React library for component development
import React from "react";
// Import ReactDOM for rendering React components
import ReactDOM from "react-dom/client";
// Import global CSS styles
import "./index.css";
// Import PersistGate for Redux state persistence
import { PersistGate } from "redux-persist/integration/react";
// Import Redux store and persistor
import { store, persistor } from "./Redux/store";
// Import Redux Provider for state management
import { Provider } from "react-redux";
// Import main App component
import App from "./App";

// Create root element for React application
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the application with Redux store and persistence
root.render(
  // Redux Provider wraps the entire app for state management
  <Provider store={store}>
    {/* PersistGate ensures Redux state is rehydrated before rendering */}
    <PersistGate loading={"loading"} persistor={persistor}>
      {/* Main App component */}
      <App />
    </PersistGate>
  </Provider>
);

// Import configureStore from Redux Toolkit for store creation
import { configureStore } from "@reduxjs/toolkit";
// Import Redux Persist functions for state persistence
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// Import localStorage as the storage engine for Redux Persist
import storage from "redux-persist/lib/storage";
// Import the main reducer for the Amazon application
import amazonReducer from "./amazonSlice";

// Configuration object for Redux Persist
const persistConfig = {
  key: "root", // Key for the persisted state in storage
  version: 1, // Version number for migration purposes
  storage, // Storage engine (localStorage in this case)
};

// Create a persisted reducer that will save state to localStorage
const persistedReducer = persistReducer(persistConfig, amazonReducer);

// Configure and create the Redux store
export const store = configureStore({
  // Root reducer with the persisted Amazon reducer
  reducer: { amazon: persistedReducer },
  // Configure middleware with serializable check exceptions for Redux Persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Redux Persist actions that are not serializable
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export the persistor for use in the app to persist state
export let persistor = persistStore(store);

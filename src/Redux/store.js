import { configureStore } from "@reduxjs/toolkit";
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
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import amazonReducer from "./amazonSlice";

/**
 * persistConfig
 * Configuration for redux-persist to enable state persistence
 */
const persistConfig = {
  key: "root", // Key for persisted data in storage
  version: 1, // Versioning for migrations
  storage, // Storage engine (localStorage)
};

// Wrap the amazon reducer with persistence capabilities
const persistedReducer = persistReducer(persistConfig, amazonReducer);

/**
 * store
 * Configures the Redux store with persisted reducer and middleware settings
 */
export const store = configureStore({
  reducer: { amazon: persistedReducer }, // Namespaced under 'amazon'
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to prevent serialization warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// persistor
// Controls persistence lifecycle (e.g., purge, flush)
export let persistor = persistStore(store);

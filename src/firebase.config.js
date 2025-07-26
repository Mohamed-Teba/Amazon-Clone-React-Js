// Firebase configuration file for the Amazon Clone application

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  PersistentLocalCache,
  memoryLocalCache,
} from "firebase/firestore";

// Firebase project configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBH-rnkDLdtJHNRLFEdOxpZMFXG__4isic",
  authDomain: "clone-teama.firebaseapp.com",
  projectId: "clone-teama",
  storageBucket: "clone-teama.appspot.com",
  messagingSenderId: "195993405439",
  appId: "1:195993405439:web:54f0ae07fc53949ca989ca",
  measurementId: "G-568839R0M7",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore with offline persistence
export const db = initializeFirestore(app, {
  localCache:
    typeof window !== "undefined"
      ? new PersistentLocalCache() // Browser: Use IndexedDB
      : memoryLocalCache(), // Server/Node: Use in-memory cache
});

// src/firebase.js أو src/firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your project settings from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDRid8SdebkCCTt7NfJsyHnW2DOuazgEZQ",
  authDomain: "fir-87c0e.firebaseapp.com",
  projectId: "fir-87c0e",
  storageBucket: "fir-87c0e.appspot.com",
  messagingSenderId: "564017203306",
  appId: "1:564017203306:web:d59d89a769168341efe213",
  measurementId: "G-EGJG5ZGVX4",
};

// Firebase configuration
const app = initializeApp(firebaseConfig);

// Preparation Auth و Database
const auth = getAuth(app);
const db = getFirestore(app);
// Export them for use in the rest of the project.
export { auth, db };

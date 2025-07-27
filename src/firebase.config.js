// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCb9J-iMD2ozBo_XOpiTuOxBA8TyZAePEI",
  authDomain: "fir-d5c36.firebaseapp.com",
  projectId: "fir-d5c36",
  storageBucket: "fir-d5c36.appspot.com",
  messagingSenderId: "651391915109",
  appId: "1:651391915109:web:665924c03559e9df8ca28c",
  measurementId: "G-1372EVYV2B"
};

export const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const db = getFirestore(app);
export default firebaseConfig;
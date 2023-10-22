// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-mucoin.firebaseapp.com",
  projectId: "mern-mucoin",
  storageBucket: "mern-mucoin.appspot.com",
  messagingSenderId: "893476489771",
  appId: "1:893476489771:web:446a85bd8b57f9a9e4386e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// src/Firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN4O1kF_U4YGg9qVP7MJrwjIgtdwPGhBA",
  authDomain: "advensure-e4fb2.firebaseapp.com",
  projectId: "advensure-e4fb2",
  storageBucket: "advensure-e4fb2.appspot.com",
  messagingSenderId: "198999165789",
  appId: "1:198999165789:web:b2bea481025cf1bfa2f6b4",
  measurementId: "G-6XDM2YW6D1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); 

export { auth, provider };

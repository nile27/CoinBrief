import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBH_ce6eVGsBYVWdogCpnY6mWCFOJrP7oY",
  authDomain: "coinbrief-a5e9e.firebaseapp.com",
  projectId: "coinbrief-a5e9e",
  storageBucket: "coinbrief-a5e9e.firebasestorage.app",
  messagingSenderId: "669995721578",
  appId: "1:669995721578:web:2fd9cd1f47b06f9c38fb13",
  measurementId: "G-3X36691X4N",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { auth, firestore };

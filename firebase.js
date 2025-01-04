// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";  // Added GoogleAuthProvider and signInWithPopup to this import
import { getFirestore, setDoc, doc } from "firebase/firestore"; // Added setDoc and doc for Firestore
import { getStorage } from "firebase/storage";

// Your Firebase configuration snippet
const firebaseConfig = {
    apiKey: "your_api_key",
    authDomain: "thriftingapp-58288.firebaseapp.com",
    projectId: "thriftingapp-58288",
    storageBucket: "thriftingapp-58288.firebasestorage.app",
    messagingSenderId: "100712752960",
    appId: "1:100712752960:web:e7ee06091f85dec1d5bca5",
    measurementId: "G-30STH5BP8Z"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Sign-In function
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);  // Sign in with Google
    const user = result.user;  // Get user details
    console.log("User signed in with Google: ", user);

    // Optionally save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: user.displayName,
      email: user.email,
    });

    // Redirect to the buy page after successful sign-in
    window.location.href = "/products"; // Navigate to buy page
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};

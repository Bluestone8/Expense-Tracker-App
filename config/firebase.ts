// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCep82aHC7KeNIXUkg8XZgj2PXp0JHRRr8",
  authDomain: "expense-tracker-3308e.firebaseapp.com",
  projectId: "expense-tracker-3308e",
  storageBucket: "expense-tracker-3308e.firebasestorage.app",
  messagingSenderId: "301874149823",
  appId: "1:301874149823:web:7b1d2d31f103f666f0490a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const firestore = getFirestore(app);

export default app;

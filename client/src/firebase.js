// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fake-state.firebaseapp.com",
  projectId: "fake-state",
  storageBucket: "fake-state.appspot.com",
  messagingSenderId: "839575790397",
  appId: "1:839575790397:web:49c3498e2c5a58eaf31b54"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
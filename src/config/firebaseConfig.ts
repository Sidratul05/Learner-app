// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnUm3axqnp38XVgqv3lqfDjRdI_ELx7VU",
  authDomain: "learner-16add.firebaseapp.com",
  projectId: "learner-16add",
  storageBucket: "learner-16add.firebasestorage.app",
  messagingSenderId: "104627708781",
  appId: "1:104627708781:web:f53d0a4926476e11f33064",
  measurementId: "G-G0DB4B56SQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);




// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9goubaSgkpTI9_Vm5LTIxTkfPi4OMhGI",
  authDomain: "grow-a-muscle.firebaseapp.com",
  projectId: "grow-a-muscle",
  storageBucket: "grow-a-muscle.firebasestorage.app",
  messagingSenderId: "69948938188",
  appId: "1:69948938188:web:9bd45ed146907d5213ef69",
  measurementId: "G-87PRYRFF9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
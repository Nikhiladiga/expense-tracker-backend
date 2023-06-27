// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCdEr82APwyvCENbQ2z2neZ3ZR3bcpbdfg",
  authDomain: "expense-tracker-backend-391021.firebaseapp.com",
  projectId: "expense-tracker-backend-391021",
  storageBucket: "expense-tracker-backend-391021.appspot.com",
  messagingSenderId: "768744557712",
  appId: "1:768744557712:web:022e375c6e78582a3b9c15",
  measurementId: "G-VEQZ12SRSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);




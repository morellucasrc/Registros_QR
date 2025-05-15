// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzmRI40M38EDi-Jw1yGxRATtNUVi-7cKw",
  authDomain: "asistenciaqr25-6a704.firebaseapp.com",
  projectId: "asistenciaqr25-6a704",
  storageBucket: "asistenciaqr25-6a704.appspot.com",
  messagingSenderId: "204769454869",
  appId: "1:204769454869:web:559c21ed0043583139d71c",
  measurementId: "G-1NRVYW073B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { FIREBASE_API_KEY } from "../../FBApiKey";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "typinggame-cea9f.firebaseapp.com",
  projectId: "typinggame-cea9f",
  storageBucket: "typinggame-cea9f.appspot.com",
  messagingSenderId: "801314896488",
  appId: "1:801314896488:web:02f2b47036ecc514c999dd",
  measurementId: "G-Y49DVK3N0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app)
export const storage = getStorage(app)






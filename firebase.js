import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDiteb_zTXN3Q4_d7e5u-5GfJDKDJ7k3W4",
  authDomain: "my-insta-84594.firebaseapp.com",
  projectId: "my-insta-84594",
  storageBucket: "my-insta-84594.appspot.com",
  messagingSenderId: "522822246863",
  appId: "1:522822246863:web:df01eb808506752675b2ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

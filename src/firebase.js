import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3lYGzIgi2T8n1LI7N8fB-VAQHRIX94ec",
  authDomain: "quizapp-4824f.firebaseapp.com",
  projectId: "quizapp-4824f",
  storageBucket: "quizapp-4824f.firebasestorage.app",
  messagingSenderId: "140731014003",
  appId: "1:140731014003:web:67366a2d70278b321e8306",
  measurementId: "G-VTMTZLGVSF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, collection, addDoc, getDocs, query, where };

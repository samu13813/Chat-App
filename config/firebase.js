import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAcqnc9fm0HY7_aHSmmABHmlBzpa1UlhuA",
    authDomain: "chatapp-9f4d7.firebaseapp.com",
    projectId: "chatapp-9f4d7",
    storageBucket: "chatapp-9f4d7.appspot.com",
    messagingSenderId: "307696379468",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service (db)
export const db = getFirestore(app);
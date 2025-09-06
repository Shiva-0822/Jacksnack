
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, collection, doc, setDoc, addDoc, deleteDoc, getDoc, serverTimestamp, increment, query, where, Timestamp, limit, orderBy } from "firebase/firestore";
import { getAuth, Auth, signInWithCustomToken } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEQBmLjdw6K7k_FTF9xVoxsF5RZjQWoMM",
  authDomain: "jacksnack-0822.firebaseapp.com",
  projectId: "jacksnack-0822",
  storageBucket: "jacksnack-0822.appspot.com",
  messagingSenderId: "482669412167",
  appId: "1:482669412167:web:955aec1e62941bd414d662",
  measurementId: "G-TRWXKGBWH4"
};

// This function ensures that we initialize the app only once
function getFirebaseApp(): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

// Export functions to get the services, which will ensure the app is initialized first.
function getFirebaseAuth(): Auth {
    return getAuth(getFirebaseApp());
}

function getFirebaseDb(): Firestore {
    return getFirestore(getFirebaseApp());
}

// We no longer export the instances directly.
// Instead, components will call these functions to get the service they need.
export { 
    getFirebaseAuth, 
    getFirebaseDb, 
    firebaseConfig, 
    collection, 
    doc, 
    setDoc, 
    addDoc, 
    deleteDoc, 
    getDoc, 
    serverTimestamp, 
    increment,
    query,
    where,
    Timestamp,
    limit,
    orderBy,
    signInWithCustomToken
};

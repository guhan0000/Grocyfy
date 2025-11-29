// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Replace with your actual config object
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_STORAGE_BUCKET",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };
const firebaseConfig = {
    apiKey: "AIzaSyBr9eNgFupEHYFRdZz6Fl3YHRrxoqR9O7Q",
    authDomain: "grocery-billing-f3b4c.firebaseapp.com",
    projectId: "grocery-billing-f3b4c",
    storageBucket: "grocery-billing-f3b4c.firebasestorage.app",
    messagingSenderId: "1070977931930",
    appId: "1:1070977931930:web:dbaf526b7d78e000155d23",
    measurementId: "G-TS3QERWDJ2"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

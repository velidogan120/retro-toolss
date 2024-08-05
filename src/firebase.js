import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlf-EuSbJwO1fn3wurdIjTy0DK34Pc1tI",
  authDomain: "retro-tools-caf65.firebaseapp.com",
  projectId: "retro-tools-caf65",
  storageBucket: "retro-tools-caf65.appspot.com",
  messagingSenderId: "302928115858",
  appId: "1:302928115858:web:8cb5995be2bf51276c8e4b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

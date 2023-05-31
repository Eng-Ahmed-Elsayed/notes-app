import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDKD1kkcDzxhriHLPVdJMjnORhFkx98svE",
    authDomain: "react-notes-app-5fdbe.firebaseapp.com",
    projectId: "react-notes-app-5fdbe",
    storageBucket: "react-notes-app-5fdbe.appspot.com",
    messagingSenderId: "385062687316",
    appId: "1:385062687316:web:d161dbb91323bd8932d3c1"
};
  

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")

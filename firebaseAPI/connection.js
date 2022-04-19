import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfuzKqfMuT9qDR0ysEjIlVUKZYe8DHMJE",
  authDomain: "littlebusiness-f5acf.firebaseapp.com",
  databaseURL: "https://littlebusiness-f5acf-default-rtdb.firebaseio.com",
  projectId: "littlebusiness-f5acf",
  storageBucket: "littlebusiness-f5acf.appspot.com",
  messagingSenderId: "199861037180",
  appId: "1:199861037180:web:26649bc0d8e41b224e41f9",
  measurementId: "G-BLMC9SLE52",
};

export const app = initializeApp(firebaseConfig),
  db = getFirestore(app);

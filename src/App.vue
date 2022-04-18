<template>
  <div id="app">
    <button v-on:click="readDocuments">print documents</button>
    <button v-on:click="addNewDocument">add Chikis</button>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export default {
  methods: {
    async readDocuments() {
      const querySnapshot = await getDocs(collection(db, "user"));
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    },

    async addNewDocument() {
      try {
        const docRef = await addDoc(collection(db, "user"), {
          id_user: 2,
          u_name: "Chikis",
          u_status: "a",
          u_type: "client",
        });
      } catch (error) {}
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

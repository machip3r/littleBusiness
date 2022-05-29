import { db } from "/firebaseAPI/connection.js";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  limit,
  query,
  orderBy,
  where,
  getDoc,
} from "firebase/firestore";

import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

const collectionName = "user";
const usersCollection = collection(db, collectionName);
const auth = getAuth();

export class User {
  constructor(u_name, u_photo, u_type, u_status, email, password) {
    this.u_name = u_name;
    this.u_photo = u_photo;
    this.u_type = u_type;
    this.u_status = u_status;
    this.email = email;
    this.password = password;
  }

  // - - - - -  Document Manipulation  - - - - -

  async createAccountUser(t) {
    let user = null;
    if (t == "c") {
      const response = await createUserWithEmailAndPassword(
        auth,
        this.email,
        this.password
      );
      const uid = response.user.uid;
      let additionalData = {
        uid: uid,
        type: this.u_type,
        status: this.u_status,
      };
      let resUpdate = await updateProfile(response.user, {
        displayName: this.u_name,
        photoURL: this.u_photo,
      });
      const docRef = await addDoc(collection(db, "user"), additionalData);

      user = response.user;
    } else if (t == "g") {
      user = await User.loginGoolge(this.u_type);
    } else {
      user = await User.loginFacebook(this.u_type);
    }
    return user;
  }

  async addUser(body) {
    try {
      body[0].id_user = await this.#newIDUser();

      const docRef = await addDoc(usersCollection, body[0]);

      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);

      return error;
    }
  }

  static async getAdditionalDataUser(uid) {
    const q = await query(usersCollection, where("uid", "==", uid));

    const docs = await getDocs(q);
    let userData = null;
    docs.forEach((value) => {
      userData = value;
    });

    return userData.data();
  }

  static async login(email, password) {
    let response = await signInWithEmailAndPassword(auth, email, password);
    return auth.currentUser;
  }

  static async searchUid(uid) {
    const q = query(usersCollection, where("uid", "==", uid));
    const docs = await getDocs(q);

    return docs;
  }

  static async loginFacebook(type) {
    const provider = new FacebookAuthProvider();
    const auth = getAuth();
    auth.languageCode = "es";
    let result = await signInWithPopup(auth, provider);
    let q = await User.searchUid(result.user.uid.toString());

    if (q.empty) {
      let additionalData = {
        uid: result.user.uid,
        type: type,
        status: 1,
      };
      const docRef = await addDoc(collection(db, "user"), additionalData);
    }

    console.log(result.user.photoURL, " ", result.user.displayName);

    return result.user;
  }

  static async loginGoolge(type) {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    auth.languageCode = "es";
    let result = await signInWithPopup(auth, provider);
    let q = await User.searchUid(result.user.uid.toString());

    if (q.empty) {
      let additionalData = {
        uid: result.user.uid,
        type: type,
        status: 1,
      };
      const docRef = await addDoc(collection(db, "user"), additionalData);
    }

    return result.user;
  }

  static async getLogedUser() {
    const auth = getAuth();
    return new Promise(resolve => onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        resolve(user);
      } else {
        // User is signed out
        resolve(null);
      }
    }));
  }

  static async logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('Saliendo de la sesión');
    }).catch((error) => {
      console.log('Error al salir de la sesión');
    });
  }

  async readUsers() {
    return this.#getObjectFromDocuments(await getDocs(usersCollection));
  }

  async readUsersLimit(limit) {
    const queryRes = query(usersCollection, limit(limit));

    return this.#getObjectFromDocuments(await getDocs(queryRes));
  }

  async readUserWithID(id_user) {
    const queryRes = query(usersCollection, where("id_user", "==", id_user));

    return this.#getObjectFromDocuments(await getDocs(queryRes));
  }

  async updateUser(id_user, body) {
    const user = doc(db, collectionName, id_user);

    await updateDoc(user, body);
  }

  #getObjectFromDocuments(documents) {
    const obj = {};

    documents.forEach((doc) => (obj[doc.id] = doc.data()));

    return obj;
  }

  // - - - - -  Utility Functions  - - - - -
  async #newIDUser() {
    const docs = await this.readUsers();
    let newID = this.#randID();

    for (let i = 0; i < docs.length; i++)
      if (docs[i].id_user === newID) {
        newID = this.#randID();
        i = 0;
      }

    return newID;
  }

  #randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  #randID() {
    let randID = "";

    for (let i = 0; i < 6; i++) randID += this.#randInt(0, 9);

    return parseInt(randID);
  }

  docsObjectToArray(documents) {
    let arr = [];

    Object.keys(documents).forEach((key) => {
      Object.assign(documents[key], { firebaseID: key });
      arr.push(documents[key]);
    });

    return arr;
  }
}

import { app, db } from "/firebaseAPI/connection.js";
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

const collectionName = "user";
const usersCollection = collection(db, collectionName);

export class User {
  constructor(u_name, u_photo, u_type, u_status) {
    this.u_name = u_name;
    this.u_photo = u_photo;
    this.u_type = u_type;
    this.u_status = u_status;
  }

  // - - - - -  Document Manipulation  - - - - -
  async addUser(body) {
    try {
      body.id_user = await this.#newID();

      const docRef = await addDoc(usersCollection, body);

      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      return error;
    }
  }

  async readUsers() {
    return this.#getArrayFromDocument(await getDocs(usersCollection));
  }

  async readUsersLimit(limit) {
    const queryRes = query(usersCollection, limit(limit));

    return this.#getArrayFromDocument(await getDocs(queryRes));
  }

  async readUserWithID(id) {
    const queryRes = query(usersCollection, where("id_user", "==", id));

    return this.#getArrayFromDocument(await getDocs(queryRes));
  }

  async updateUser(id, body) {
    const user = doc(db, collectionName, id);

    await updateDoc(user, body);
  }

  #getArrayFromDocument(documents) {
    const array = [];
    const obj = {};

    documents.forEach((doc) => {
      obj[doc.id] = doc.data();
      array.push(doc.data());
    });

    return obj;
  }

  #getObjectFromDocument(documents) {}

  // - - - - -  Utility Functions  - - - - -
  async #newID() {
    const docs = await this.readUsers();
    const SIZE = docs.length;
    let newID = this.#randID();

    for (let i = 0; i < SIZE; i++) {
      if (docs[i].id_user === newID) {
        newID = this.#randID();
        i = 0;
      }
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
}

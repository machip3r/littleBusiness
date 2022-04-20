import {db} from "/firebaseAPI/connection.js";
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
      body.id_user = await this.#newIDUser();

      const docRef = await addDoc(usersCollection, body);

      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);

      return error;
    }
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
}

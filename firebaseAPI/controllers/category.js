import { db, storage } from "/firebaseAPI/connection.js";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  limit,
  query,
  orderBy,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const collectionName = "category";
const categoryCollection = collection(db, collectionName);

export class Category {
  constructor(id_category, c_name, c_icon) {
    this.id_category = id_category;
    this.c_name = c_name;
    this.c_icon = c_icon;
  }

  async readCategories() {
    return this.#getObjectFromDocuments(await getDocs(categoryCollection));
  }

  #getObjectFromDocuments(documents) {
    const obj = {};

    documents.forEach((doc) => (obj[doc.id] = doc.data()));

    return obj;
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

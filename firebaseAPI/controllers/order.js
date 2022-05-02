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

const collectionName = "order";
const ordersCollection = collection(db, collectionName);

export class Order {
  constructor(id_order, id_user, o_products, o_datetime, o_status) {
    this.id_order = id_order;
    this.id_user = id_user;
    this.o_products = o_products;
    this.o_datetime = o_datetime;
    this.o_status = o_status;
  }

  // - - - - -  Document Manipulation  - - - - -
  async addOrder(body) {
    try {
      body.id_order = await this.#newOrderID();

      const docRef = await addDoc(ordersCollection, body);

      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);

      return error;
    }
  }

  async readOrders() {
    return this.#getObjectFromDocuments(await getDocs(ordersCollection));
  }

  async readOrderWithID(id_order) {
    const queryRes = query(ordersCollection, where("id_order", "==", id_order));

    return this.#getObjectFromDocuments(await getDocs(queryRes));
  }

  async updateOrder(id_order, body) {
    const order = doc(db, collectionName, id_order);
    await updateDoc(order, body);
  }

  #getObjectFromDocuments(documents) {
    const obj = {};

    documents.forEach((doc) => (obj[doc.id] = doc.data()));

    return obj;
  }

  // - - - - -  Utility Functions  - - - - -
  async #newOrderID() {
    const docs = await this.readOrders();
    let newID = this.#randID();

    for (let i = 0; i < docs.lenght; i++)
      if (docs[i].id_order === newID) {
        newID = this.#randID();
        i = 0;
      }

    return newID;
  }

  #randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  #randID() {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const STRING_SIZE = possible.length;
    let randID = "";

    for (let i = 0; i < 9; i++)
      randID += possible[this.#randInt(0, STRING_SIZE - 1)];

    return randID;
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

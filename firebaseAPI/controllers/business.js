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
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const collectionName = "business";
const businessCollection = collection(db, collectionName);

export class Business {
  constructor(
    id_user,
    id_category,
    b_name,
    b_descrption,
    b_status,
    b_schedule
  ) {
    this.id_user = id_user;
    this.id_category = id_category;
    this.b_name = b_name;
    this.b_descrption = b_descrption;
    this.b_status = b_status;
    this.b_schedule = b_schedule;
  }

  //  -  -  -  -  -  Document Manipulation  - -

  async create() {
    try {
      let id_business = await this.#randID();
      const docRef = await addDoc(businessCollection, {
        id_business: id_business,
        id_user: this.id_user,
        id_category: this.id_category,
        b_name: this.b_name,
        b_description: this.b_descrption,
        b_schedule: this.b_schedule,
        b_status: true,
      });

      return docRef.id;
    } catch (err) {
      console.log("Error adding document: ", err);
      return undefined;
    }
  }

  async addBusiness(body) {
    try {
      body.id_business = await this.#newBusinessID();

      const docRef = await addDoc(businessCollection, body);

      return docRef.id;
    } catch (error) {
      console.log("Error adding document: ", error);

      return error;
    }
  }

  async readBusiness() {
    return this.#getObjectFromDocuments(await getDocs(businessCollection));
  }

  async readBusinessWithID(id_business) {
    const queryRes = query(
      businessCollection,
      where("id_business", "==", id_business)
    );

    return this.#getObjectFromDocuments(await getDocs(queryRes));
  }

  async updateBusiness(id_business, body) {
    const business = doc(db, collectionName, id_order);
    await updateDoc(business, body);
  }

  #getObjectFromDocuments(documents) {
    const obj = {};

    documents.forEach((doc) => (obj[doc.id] = doc.data()));

    return obj;
  }

  // - - - - -  Utility Functions  - - - - -
  async #newBusinessID() {
    const docs = await this.readOrders();
    let newID = this.#randID();

    for (let i = 0; i < docs.lenght; i++)
      if (docs[i].id_business === newID) {
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

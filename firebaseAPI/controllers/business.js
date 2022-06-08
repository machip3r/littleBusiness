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
const reviews = collection(db, "review");
const productsCollection = collection(db, "product");

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

  static async getstatistics(id_business) {
    let statistics = {};

    const reviewsTemp = collection(db, "review");
    const q = await query(reviewsTemp, where("id_business", "==", id_business));

    const docs = await getDocs(q);
    let promedio = 0;
    let count = 0;
    docs.forEach((item) => {
      promedio += item.data().r_rate;
      count++;
    });

    statistics.mean = promedio / count;

    await this.getMinMax(id_business, statistics);

    return statistics;
  }

  static async getMinMax(id_business, statistics) {
    const productsCollectionTemp = collection(db, "product");

    const qProduct = await query(
      productsCollectionTemp,
      where("id_business", "==", id_business)
    );
    const docsProducts = await getDocs(qProduct);
    let prices = [];
    docsProducts.forEach((value) => {
      prices.push(Number(value.data().p_price));
    });

    console.log(prices);
    if (prices.length > 0) {
      prices.sort();
      statistics.maxPrice = prices[prices.length - 1];
      statistics.minPrice = prices[0];
    } else {
      statistics.minPrice = 0;
      statistics.maxPrice = 0;
    }
  }

  static async readBusinessWithID(id_business) {
    const q = await query(
      businessCollection,
      where("id_business", "==", id_business)
    );

    const doc = await getDocs(q);

    //console.log(list);
    let business = doc.docs[0].data();
    business.b_schedule = JSON.parse(business.b_schedule);
    business.name = getAuth().currentUser.displayName;

    return business;
  }

  async update(id_business) {
    try {
      const q = await query(
        businessCollection,
        where("id_business", "==", id_business)
      );
      const docs = await getDocs(q);

      let docRef;

      docs.forEach((item) => {
        docRef = item.ref;
      });

      await updateDoc(docRef, {
        id_business: id_business,
        id_user: this.id_user,
        id_category: this.id_category,
        b_name: this.b_name,
        b_description: this.b_descrption,
        b_schedule: this.b_schedule,
        b_status: true,
      });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async updateBusiness(id_business, body) {
    const business = doc(db, collectionName, id_orden);
    await updateDoc(business, body);
  }

  static async getBussinesByUId() {
    const uid = getAuth().currentUser.uid;

    const q = await query(businessCollection, where("id_user", "==", uid));

    const docs = await getDocs(q);

    let list = [];
    docs.forEach((value) => {
      list.push(value.data());
    });

    //console.log(list);
    return list;
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

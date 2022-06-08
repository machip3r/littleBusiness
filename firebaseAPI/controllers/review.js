import { db, storage } from "/firebaseAPI/connection.js";
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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const collectionName = "review";
const reviewCollection = collection(db, collectionName);


export class Review {
  constructor(id_user, u_name, id_business, r_rate, r_description, r_datetime, r_status) {
    this.id_user = id_user;
    this.u_name = u_name;
    this.id_business = id_business;
    this.r_rate = r_rate;
    this.r_description = r_description;
    this.r_datetime = r_datetime;
    this.r_status = r_status;
  }

  //  -  -  -  -  -  Document Manipulation  - -

  async create() {
    try {
      let id_review = await this.#randID();
      const docRef = await addDoc(reviewCollection, {
        id_review: id_review,
        id_user: this.id_user,
        u_name: this.u_name,
        id_business: this.id_business,
        r_rate: this.r_rate,
        r_description: this.r_descrption,
        r_datetime: this.r_datetime,
        r_status: true
      });

      return docRef.id;
    } catch (err) {
      console.log("Error adding document: ", err);
      return undefined;
    }
  }

  async addReview(body) {
    try {
      body.id_review = await this.#newReviewID();
    
      const docRef = await addDoc(reviewCollection, body);
      console.log("todo bien papu");
      return docRef.id;

    } catch (error) {
      console.log("Error adding document: ", error);

      return error;
    }
  }

  async readReview() {
    return this.#getObjectFromDocuments(await getDocs(reviewCollection));
  }

  async readReviews() {
    return this.#getObjectFromDocuments(await getDocs(reviewCollection));
  }

  async readReviewWithID(id_review) {
    const queryRes = query(
      reviewCollection,
      where("id_review", "==", id_review)
    );

    return this.#getObjectFromDocuments(await getDocs(queryRes));
  }

  async updateReview(id_review, body) {
    const review = doc(db, collectionName, id_user);
    await updateDoc(review, body);
  }
  
  #getObjectFromDocuments(documents) {
    const obj = {};

    documents.forEach((doc) => (obj[doc.id] = doc.data()));

    return obj;
  }

  // - - - - -  Utility Functions  - - - - -
  async #newReviewID() {
    const docs = await this.readReviews();
    let newID = this.#randID();

    for (let i = 0; i < docs.lenght; i++)
      if (docs[i].id_review === newID) {
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
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

const collectionName = "product";
const productsCollection = collection(db, collectionName);

export class Product {
  constructor(p_name, p_photo, p_description, p_category) {
    this.p_name = p_name;
    this.p_photo = p_photo;
    this.p_description = p_description;
    this.p_category = p_category;
  }

  // - - - - -  Document Manipulation  - - - - -
  async addProduct(body) {
    try {
      body.id_product = await this.#newIDProduct();

      const docRef = await addDoc(productsCollection, body);

      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);

      return error;
    }
  }

  async readProducts() {
    return this.#getObjectFromDocuments(await getDocs(productsCollection));
  }

  async readProductsLimit(limit) {
    const queryRes = query(productsCollection, limit(limit));

    return this.#getObjectFromDocuments(await getDocs(queryRes));
  }

  async readProductWithID(id_product) {
    const queryRes = query(productsCollection, where("id_product", "==", id_product));

    return this.#getObjectFromDocuments(await getDocs(queryRes));
  }

  async updateProduct(id_product, body) {
    const product = doc(db, collectionName, id_product);

    await updateDoc(product, body);
  }

  #getObjectFromDocuments(documents) {
    const obj = {};

    documents.forEach((doc) => (obj[doc.id] = doc.data()));

    return obj;
  }

  // - - - - -  Utility Functions  - - - - -
  async #newIDProduct() {
    const docs = await this.readProducts();
    let newID = this.#randID();

    for (let i = 0; i < docs.length; i++)
      if (docs[i].id_product === newID) {
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

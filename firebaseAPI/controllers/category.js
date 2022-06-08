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
import { getAuth } from "firebase/auth";

export async function getCategories() {
  const queryDocs = await getDocs(collection(db, "category"));
  let docs = [];
  queryDocs.forEach((doc) => {
    docs.push(doc.data());
  });
  return docs;
}

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

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
        u_name: this.u_name,
        u_photo: this.u_photo,
      };
      let resUpdate = await updateProfile(response.user, {
        displayName: this.u_name,
        photoURL: this.u_photo,
      });
      const docRef = await addDoc(collection(db, "user"), additionalData);

      await User.login(this.email, this.password);
      user = response.user;
    } else if (t == "g") {
      user = await User.loginGoolge(this.u_type);
    } else {
      user = await User.loginFacebook(this.u_type);
    }
    return user;
  }

  static async updateUserName(name) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (name === null) name = user.displayName;

    updateProfile(user, { displayName: name })
      .then(() => {
        return true;
      })
      .catch((e) => {
        return false;
      });
  }

  static async updateUserPhoto(photo) {
    return new Promise(async (resolve) => {
      if (photo !== null && photo !== undefined) {
        try {
          //----Compress Image-------------------------
          const compressedPhoto = await compressImage(photo, 80);
          //---------------------------------------------
          const metadata = {
            contentType: "image/jpeg",
          };
          const storageRef = ref(storage, `users/${Date.now()}_${photo.name}`);
          const uploadTask = uploadBytesResumable(
            storageRef,
            compressedPhoto,
            metadata
          );

          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              switch (error.code) {
                case "storage/unauthorized":
                  // User doesn't have permission to access the object

                  break;
                case "storage/canceled":
                  // User canceled the upload

                  break;
                case "storage/unknown":
                  // Unknown error occurred, inspect error.serverResponse

                  break;
              }
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  const auth = getAuth();
                  const user = auth.currentUser;
                  updateProfile(user, { photoURL: downloadURL })
                    .then(() => {
                      resolve(downloadURL);
                    })
                    .catch((e) => {
                      return false;
                    });
                }
              );
            }
          );
        } catch (error) {
          console.error("Error adding product: ", error);
          return error;
        }
      }
    });
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
    return new Promise((resolve) =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          resolve(user);
        } else {
          // User is signed out
          resolve(null);
        }
      })
    );
  }

  static async logout() {
    const auth = getAuth();
    return new Promise((resolve) =>
      signOut(auth)
        .then(() => {
          resolve("Ok");
        })
        .catch((error) => {
          resolve("Fail");
        })
    );
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

function compressImage(imageFile, quality) {
  return new Promise((resolve, reject) => {
    const $canvas = document.createElement("canvas");
    const imagen = new Image();
    imagen.onload = () => {
      $canvas.width = imagen.width;
      $canvas.height = imagen.height;
      $canvas.getContext("2d").drawImage(imagen, 0, 0);
      $canvas.toBlob(
        (blob) => {
          if (blob === null) {
            return reject(blob);
          } else {
            resolve(blob);
          }
        },
        "image/jpeg",
        quality / 100
      );
    };
    imagen.src = URL.createObjectURL(imageFile);
  });
}

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

const collectionName = "product";
const productsCollection = collection(db, collectionName);

//------------------- Comprimir Imagen ----------------------
const comprimirImagen = (imagenComoArchivo, porcentajeCalidad) => {
  
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
        porcentajeCalidad / 100
      );
    };
    imagen.src = URL.createObjectURL(imagenComoArchivo);
  });
};

const TAM_MAX = 1000000;

//-----------------------------------------------------------

export class Product {
  constructor(p_name, p_photo, p_price, p_description, p_category) {
    this.p_name = p_name;
    this.p_photo = p_photo;
    this.p_price = p_price;
    this.p_description = p_description;
    this.p_category = p_category;
  }

  // - - - - -  Document Manipulation  - - - - -
  async addProduct(body) {
    try {
      body.id_product = await this.#newIDProduct();
      //----Comprimir Imagen-------------------------
      const archivo = body.p_photo;
      if (archivo.size > TAM_MAX)
      {
        const reduccion = parseInt(TAM_MAX*100/archivo.size);
        const blob = await comprimirImagen(archivo, reduccion);
      }
      else {
        const blob = await comprimirImagen(archivo, 100);
      }
      //---------------------------------------------
      const metadata = {
        contentType: "image/jpeg",
      };
      const storageRef = ref(
        storage,
        `products/${Date.now()}_${body.p_photo.name}`
      );
      const uploadTask = uploadBytesResumable(
        storageRef,
        //body.p_photo,
        blob,
        metadata
      );
      body.p_saved = true;

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          // switch (snapshot.state) {
          //   case 'paused':
          //     console.log('Upload is paused');
          //     break;
          //   case 'running':
          //     console.log('Upload is running');
          //     break;
          // }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              console.log("No tienes permiso de subir archivos padrino");
              break;
            case "storage/canceled":
              // User canceled the upload
              console.log("Cancelaste la subida mi hermano");
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              console.log("¿Qué pasó?");
              break;
          }
          body.p_saved = false;
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            async function save() {
              const docRef = await addDoc(productsCollection, {
                id_product: body.id_product,
                id_business: body.id_business,
                p_name: body.p_name,
                p_price: body.p_price,
                p_photo: downloadURL,
                p_description: body.p_description,
                p_category: body.p_category,
                p_status: true,
              });
              body.p_saved = false;
              return docRef.id;
            }
            return save();
          });
        }
      );
    } catch (error) {
      console.error("Error adding product: ", error);
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
    const queryRes = query(
      productsCollection,
      where("id_product", "==", id_product)
    );

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

  docsObjectToArray(documents) {
    let arr = [];

    Object.keys(documents).forEach((key) => {
      Object.assign(documents[key], { firebaseID: key });
      arr.push(documents[key]);
    });

    return arr;
  }
}

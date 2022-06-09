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
import { User } from "./user";

const collectionName = "business";
const businessCollection = collection(db, collectionName);
const reviews = collection(db, "review");
const productsCollection = collection(db, "product");

export class Business {
  constructor(id_user, b_name, b_descrption, b_status, b_schedule) {
    this.id_user = id_user;
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
        b_name: this.b_name,
        b_description: this.b_descrption,
        b_schedule: this.b_schedule,
        b_status: true,
      });

      return id_business;
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
      return error;
    }
  }

  async readBusiness() {
    return this.#getObjectFromDocuments(await getDocs(businessCollection));
  }

  async readUserBusiness(uid) {
    const queryRes = query(businessCollection, where("id_user", "==", uid));
    return this.#getObjectFromDocuments(await getDocs(queryRes));
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

    statistics.mean = count > 0 ? promedio / count : 0;

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

    //
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
        b_name: this.b_name,
        b_description: this.b_descrption,
        b_schedule: this.b_schedule,
        b_status: true,
      });

      return true;
    } catch (err) {
      return false;
    }
  }

  async updateBusiness(id_business, body) {
    const business = doc(db, collectionName, id_orden);
    await updateDoc(business, body);
  }

  static async getBussinesByUId(uid) {
    const q = await query(
      businessCollection,
      where("id_user", "==", uid.toString())
    );

    const docs = await getDocs(q);

    let list = [];
    docs.forEach((value) => {
      list.push(value.data());
    });

    //
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

export async function getProductosByBusiness(id_business) {
  const products = collection(db, "product");
  const q = await query(products, where("id_business", "==", id_business));

  const docs = await getDocs(q);
  let listProducts = [];

  docs.forEach((product) => {
    listProducts.push(product.data());
  });

  return listProducts;
}

export async function getDataOrdersByBusiness(id_business) {
  const orders = collection(db, "order");
  const q = await query(orders);

  const docs = await getDocs(q);

  let listOrders = [];

  const listProducts = await getProductosByBusiness(id_business);

  docs.forEach((order) => {
    const tempOrder = order.data();
    const tempOProduct = tempOrder.o_products;

    tempOProduct.forEach((item) => {
      let id_product = item.id_product;
      let index = listProducts.findIndex((it) => it.id_product == id_product);
      if (index >= 0) {
        listOrders.push({
          id_order: tempOrder.id_order,
          id_user: tempOrder.id_user,
          id_product: id_product,
          p_price: listProducts[index].p_price,
          p_name: listProducts[index].p_name,
          p_photo: listProducts[index].p_photo,
          p_status: item.p_status,
          date: new Date(tempOrder.o_datetime),
          o_datetime: tempOrder.o_datetime,
          op_quantity: item.op_quantity,
          o_status: item.p_status,
          u_name: tempOrder.u_name,
          firebaseID: order.id,
        });
      }
    });
  });

  return listOrders;
}

export async function getSumProducts(id_business) {
  const listOrders = await getDataOrdersByBusiness(id_business);

  let listSumProducts = [];

  if (listOrders.length > 0) {
    listSumProducts.push({
      id_product: listOrders[0].id_product,
      total: listOrders[0].op_quantity,
      totalCash: listOrders[0].op_quantity * listOrders[0].p_price,
      p_name: listOrders[0].p_name,
      p_photo: listOrders[0].p_photo,
      p_price: listOrders[0].p_price,
      o_status: listOrders[0].p_status,
    });
    listOrders.forEach((order) => {
      const id = order.id_product;
      const index = listSumProducts.findIndex((item) => item.id_product == id);
      if (index >= 0) {
        listSumProducts[index].total += order.op_quantity;
        listSumProducts[index].totalCash += order.op_quantity * order.p_price;
      } else {
        listSumProducts.push({
          id_product: order.id_product,
          total: order.op_quantity,
          totalCash: order.op_quantity * order.p_price,
          p_name: order.p_name,
          p_photo: order.p_photo,
          p_price: order.p_price,
          o_status: order.p_status,
        });
      }
    });
  }

  //listSumProducts = listSumProducts.filter(item=> item.p_status == 'c');
  listSumProducts.sort((a, b) => {
    if (a.total > b.total) {
      return 1;
    } else {
      return -1;
    }
  });

  return listSumProducts;
}

export async function getDataFromDate(id_business) {
  let monthData = [];
  let dataMonthDay = [];
  const dt = new Date();
  const year = dt.getFullYear();

  for (let i = 0; i < 12; i++) {
    monthData.push(0);
    let daysInMonth = new Date(year, i + 1, 0).getDate();
    dataMonthDay.push([]);
    for (let j = 0; j < daysInMonth; j++) {
      dataMonthDay[i].push(0);
    }
  }

  const listOrders = await getDataOrdersByBusiness(id_business);
  listOrders.forEach((order) => {
    if (order.o_status == "d") {
      const date = order.date;
      if (date.getFullYear() == year) {
        monthData[date.getMonth()] += order.p_price * order.op_quantity;
        dataMonthDay[date.getMonth()][date.getDate() - 1] =
          order.p_price * order.op_quantity;
      }
    }
  });
  return { monthData, dataMonthDay };
}

export async function getCountReviewDate(id_business) {
  let count = 0;

  const q = await query(reviews, where("id_business", "==", id_business));
  const docs = await getDocs(q);
  docs.forEach((value) => {
    let item = value.data();
    item.r_datetime = new Date(item.r_datetime);
    let now = new Date(Date.now());

    if (
      (item.r_datetime.getDate() == now.getDate() &&
        now.getFullYear() == item.r_datetime.getFullYear()) ||
      item.r_datetime.getMonth() == now.getMonth()
    ) {
      count++;
    }
  });

  return count;
}

//d,p

export async function getDataBusinessID(id_business) {
  const q = await query(
    businessCollection,
    where("id_business", "==", id_business)
  );
  const docs = await getDocs(q);

  let data = null;
  docs.forEach((item) => {
    data = item.data();
  });

  data.b_schedule = JSON.parse(data.b_schedule);

  if (data) {
    let uid = data.id_user;
    const aditionalUserData = await User.getAdditionalDataUser(uid);

    data.name = aditionalUserData.u_name;
    data.u_photo = aditionalUserData.u_photo;
  }

  return data;
}

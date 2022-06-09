import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
import { getAuth } from "firebase/auth";
import { User } from "../../firebaseAPI/controllers/user.js";
import { Business } from "../../firebaseAPI/controllers/business";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", null);
      if (store.getters.getAccessToken) router.push("/home");
      next();
    },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("../views/Signup.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", null);
      if (store.getters.getAccessToken) router.push("/home");
      next();
    },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", false);
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: { title: "Home" },
  },
  {
    path: "/user",
    name: "User",
    component: () => import("../views/User.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", false);
      if (!store.getters.getAccessToken) router.push("/");

      next();
    },
    meta: { title: "User" },
  },
  {
    path: "/addBusiness",
    name: "AddBusiness",
    component: () => import("../views/business/AddBusiness.vue"),

    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", true);

      if (!store.getters.getAccessToken) router.push("/");

      const uid = getAuth().currentUser.uid;

      User.getAdditionalDataUser(uid).then((value) => {
        if (value.type) {
          next();
        } else {
          router.push("/");
        }
      });
    },
  },
  {
    path: "/dashboard/:id",
    name: "Dashboard",
    component: () => import("../views/business/Dashboard.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", true);

      if (!store.getters.getAccessToken) router.push("/");

      let id = to.params.id;

      const uid = getAuth().currentUser.uid;
      Business.getBussinesByUId(uid).then((value) => {
        let validate = value.some((item) => item.id_business == id);

        if (validate) {
          next();
        } else {
          router.push("/");
        }
      });
      next();
    },
    meta: { title: "Dashboard" },
  },
  {
    path: "/editBusiness/:id",
    name: "EditBusiness",
    component: () => import("../views/business/EditBusiness.vue"),
    beforeEnter: (to, from, next) => {
      if (!to.params.id) router.push("/");
      if (!store.getters.getAccessToken) router.push("/");
      let id = to.params.id;
      const uid = getAuth().currentUser.uid;
      Business.getBussinesByUId(uid).then((value) => {
        let validate = value.some((item) => item.id_business == id);
        if (validate) {
          next();
        } else {
          router.push("/");
        }
      });
      next();
    },
    meta: { title: "Edit business" },
  },
  {
    path: "/review/:id",
    name: "Review",
    component: () => import("../views/business/Review.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", true);
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: { title: "Review" },
  },
  {
    path: "/information/:id",
    name: "Information",
    component: () => import("../views/business/Information.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", true);
      if (!to.params.id) router.push("/");

      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: { title: "Information" },
  },
  {
    path: "/addProduct",
    name: "AddProduct",
    component: () => import("../views/products/AddProduct.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", null);
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  {
    path: "/editProduct/:id",
    name: "EditProduct",
    component: () => import("../views/products/EditProduct.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", null);
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  {
    path: "/order",
    name: "Order",
    component: () => import("../views/Order.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: { title: "Order" },
  },
  {
    path: "/orderSeller",
    name: "OrderSeller",
    component: () => import("../views/business/OrderSeller.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: { title: "Order" },
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../components/OrderDetails.vue"),
    beforeEnter: (to, from, next) => {
      if (store.state.sellerView === null) store.dispatch("modifyView", false);
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: { title: "Cart" },
  },
  {
    path: "/product",
    name: "Product",
    component: () => import("../components/ProductDetails.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", null);
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  {
    path: "/products/:id",
    name: "Products",
    component: () => import("../views/products/Products.vue"),
    beforeEnter: (to, from, next) => {
      store.dispatch("modifyView", true);
      const user = getAuth().currentUser;

      const dataAdditional = User.getAdditionalDataUser(user.uid);

      if (!user && !dataAdditional.type) router.push("/");
      next();
    },
    meta: { title: "Products" },
  },
  {
    path: "/addReview/:id",
    name: "AddReview",
    component: () => import("../views/review/AddReview.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

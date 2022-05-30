import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
import { getAuth } from "firebase/auth";
import { getAdditionalDataUser } from "../../firebaseAPI/controllers/user";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
    beforeEnter: (to, from, next) => {
      if (store.getters.getAccessToken) router.push("/products");
      next();
    },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("../views/Signup.vue"),
    beforeEnter: (to, from, next) => {
      if (store.getters.getAccessToken) router.push("/products");
      next();
    },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  {
    path: "/user",
    name: "User",
    component: () => import("../views/User.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  {
    path: "/addBusiness",
    name: "AddBusiness",
    component: () => import("../views/business/AddBusiness.vue"),
    beforeEnter: (to, from, next) => {
      const user = getAuth().currentUser;

      if (user != null) {
        const dataAdditional = getAdditionalDataUser(user.uid);
        if (!dataAdditional.type) router.push("/products");
      } else {
        router.push("/");
      }

      next();
    },
  },
  /* Agregar restriccion de entrada si no es vendedor */
  {
    path: "/business",
    name: "Business",
    component: () => import("../views/business/Business.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/business/Dashboard.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  {
    path: "/information",
    name: "Information",
    component: () => import("../views/business/Information.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  {
    path: "/review",
    name: "Review",
    component: () => import("../views/business/Review.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  {
    path: "/addProduct",
    name: "AddProduct",
    component: () => import("../views/products/AddProduct.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  // {
  //   path: "/cart",
  //   name: "Cart",
  //   component: () => import("../views/products/Cart.vue"),
  //   beforeEnter: (to, from, next) => {
  //     if (!store.getters.getAccessToken) router.push("/");
  //     next();
  //   },
  // },
  // {
  //   path: "/product",
  //   name: "Product",
  //   component: () => import("../views/products/ProductInfo.vue"),
  //   beforeEnter: (to, from, next) => {
  //     if (!store.getters.getAccessToken) router.push("/");
  //     next();
  //   },
  // },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/products/Products.vue"),
    beforeEnter: (to, from, next) => {
      const user = getAuth().currentUser;

      const dataAdditional = getAdditionalDataUser(user.uid);

      if (!user && !dataAdditional.type) router.push("/");
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

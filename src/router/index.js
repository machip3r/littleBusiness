import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
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
    component: () => import("../views/SignUp.vue"),
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
    path: "/addProduct",
    name: "NewProduct",
    component: () => import("../views/products/AddProduct.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/products/Products.vue"),
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
      if (!store.getters.getAccessToken) router.push("/");
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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

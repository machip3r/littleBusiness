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
      if (store.getters.getAccessToken) router.push("/home");
      next();
    },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("../views/Signup.vue"),
    beforeEnter: (to, from, next) => {
      if (store.getters.getAccessToken) router.push("/home");
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
    meta: {title: "Home"},
  },
  {
    path: "/user",
    name: "User",
    component: () => import("../views/User.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: {title: "User"},
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
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/business/Dashboard.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: {title: "Dashboard"},
  },
  {
    path: "/information",
    name: "Information",
    component: () => import("../views/business/Information.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: {title: "Information"},
  },
  {
    path: "/review",
    name: "Review",
    component: () => import("../views/business/Review.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: {title: "Review"},
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
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../components/OrderDetails.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.getters.getAccessToken) router.push("/");
      next();
    },
    meta: {title: "Cart"},
  },
  {
    path: "/product",
    name: "Product",
    component: () => import("../components/ProductDetails.vue"),
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
    meta: {title: "Products"},
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

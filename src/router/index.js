import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import("../views/User.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/signup",
    name: "Sign Up",
    component: () => import("../views/Signup.vue"),
  },
  {
    path: "/addProduct",
    name: "New Product",
    component: () => import("../views/Store/Products/AddProduct.vue"),
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/Store/Products/Products.vue"),
  },
  {
    path: "/addbusiness",
    name: "AddBusiness",
    component: () => import("../views/AddBusiness.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

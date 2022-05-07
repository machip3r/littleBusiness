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
      if (store.getters.getAccessToken) {
        router.push("Products");
      }
      next();
    },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("../views/SignUp.vue"),
    beforeEnter: (to, from, next) => {
      if (store.getters.getAccessToken) {
        router.push("Products");
      }
      next();
    },
  },
  {
    path: "/user",
    name: "User",
    component: () => import("../views/User.vue"),
  },
  {
    path: "/addProduct",
    name: "NewProduct",
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

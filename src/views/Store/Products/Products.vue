<template>
  <div class="pa-8">
    <div class="d-flex justify-space-between align-center">
      <h1>Descubre</h1>
      <v-spacer></v-spacer>
      <v-text-field
        label="Buscar producto"
        color="primary"
        background-color="secondary"
        append-icon="fas fa-search"
        filled
        rounded
        dense
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn class="button-fab rounded-circle" color="accent"></v-btn>
      <v-btn class="button-fab rounded-circle" color="accent" dense large
        ><v-icon>fa-shopping-cart</v-icon></v-btn
      >
      <v-btn class="button-fab rounded-circle" color="accent" dense large
        ><v-icon>fas fa-user</v-icon></v-btn
      >
    </div>

    <div class="d-flex mb-4">
      <h2>Categorías</h2>
    </div>

    <div class="d-flex justify-space-around">
      <v-icon>fas fa-fork</v-icon>
      <v-btn
        width="120"
        height="120"
        class="gradient-background"
        elevation="0"
        rounded
        v-for="(category, index) in categories"
        :key="index"
      >
        <div class="flex-column">
          <v-icon size="55">{{ category.icon }}</v-icon>
          <h5>
            {{ category.name }}
          </h5>
        </div>
      </v-btn>
    </div>

    <div class="d-flex flex-wrap my-4">
      <v-card width="169" height="230"> asdf </v-card>
    </div>
  </div>
</template>

<script>
import { Product } from "/firebaseAPI/controllers/product.js";

const ProductClass = new Product();

module.exports = {
  name: "Products",
  data() {
    return {
      categories: {},
      categories: [
        { name: "All", icon: "fas fa-globe" },
        { name: "Food", icon: "fas fa-utensils" },
        { name: "Clothes", icon: "fas fa-tshirt" },
        { name: "Art", icon: "fas fa-paint-brush" },
        { name: "Services", icon: "fas fa-handshake" },
        { name: "All", icon: "fas fa-globe" },
        { name: "Food", icon: "fas fa-utensils" },
        { name: "Clothes", icon: "fas fa-tshirt" },
        { name: "Art", icon: "fas fa-paint-brush" },
        { name: "Services", icon: "fas fa-handshake" },
      ],
    };
  },
  methods: {
    async readDocuments() {
      await ProductClass.readProducts().then((res) => console.log(res));
    },
  },
};
</script>

<style lang="css">
@import "../../../styles/main.css";
</style>

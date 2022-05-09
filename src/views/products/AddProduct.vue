<template>
  <v-container class="my-3 px-5">
    <h2 class="font-weight-bold font-nunito">Nuevo Producto</h2>
    <v-form ref="form" lazy-validation class="mt-5 mb-10">
      <v-file-input
        v-model="product.p_photo"
        label="Foto del producto"
        color="primary"
        background-color="secondary"
        prepend-inner-icon="fas fa-camera"
        prepend-icon=""
        accept="image/*"
        filled
        rounded
        dense
      ></v-file-input>
      <v-text-field
        v-model="product.p_name"
        label="Nombre del producto"
        color="primary"
        background-color="secondary"
        prepend-inner-icon="fas fa-tshirt"
        filled
        rounded
        dense
        required
      ></v-text-field>
      <v-text-field
        v-model="product.p_price"
        label="Precio"
        color="primary"
        type="number"
        background-color="secondary"
        prepend-inner-icon="fas fa-dollar-sign"
        filled
        rounded
        dense
        required
      ></v-text-field>
      <v-textarea
        v-model="product.p_description"
        label="Descripción"
        no-resize
        rows="7"
        color="primary"
        background-color="secondary"
        prepend-inner-icon="fas fa-comment-dots"
        filled
        rounded
        dense
      ></v-textarea>
      <v-select
        v-model="product.p_category"
        :items="items"
        label="Categoria"
        color="primary"
        background-color="secondary"
        prepend-inner-icon="fas fa-tag"
        filled
        rounded
        dense
        required
      ></v-select>
    </v-form>
    <v-footer absolute color="#fff">
      <v-col class="text-center" cols="12">
        <v-btn
          class="px-16"
          label="Add"
          color="primary"
          large
          dense
          rounded
          v-on:click="addNewProduct"
          :loading="product.p_saved"
        >
          <div class="mx-10">
            <v-icon left> fas fa-check </v-icon>
            Agregar
          </div>
        </v-btn>
      </v-col>
    </v-footer>
  </v-container>
</template>

<script>
import {Product} from "/firebaseAPI/controllers/product.js";

export default {
  name: "AddProduct",
  data() {
    return {
      product: {
        id_user: 1,
        id_product: 0,
        p_photo: null,
        p_name: "",
        p_price: 0,
        p_description: "",
        p_category: "",
        p_saved: false,
      },
      items: ["Categoria 1", "Categoria 2"],
    };
  },
  async created() {
    // Validar que el usuario esté loggeado
  },
  methods: {
    async addNewProduct() {
      const product = new Product();
      product.addProduct(this.product).then().catch();
    },
  },
};
</script>

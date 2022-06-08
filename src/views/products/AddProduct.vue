<template>
  <v-container fluid class="my-3 px-5">
    <v-btn
        class="fab-back-business"
        dark
        color="primary"
        fab
        small
        left
        top
        @click="goBackToProducts()"
      >
        <v-icon class="icon-back-business" size="15">fas fa-arrow-left</v-icon>
      </v-btn>
    <ProductForm title="Añadir Producto"/>
  </v-container>
</template>

<script>
import ProductForm from "@/components/ProductForm.vue";

export default {
  name: "AddProduct",
  components: {
    ProductForm,
  },
  data() {
    return {};
  },
  async created() {},
  methods: {},
};
</script>

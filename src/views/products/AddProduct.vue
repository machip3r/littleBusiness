<template>
  <v-container fluid class="my-3 px-5">
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

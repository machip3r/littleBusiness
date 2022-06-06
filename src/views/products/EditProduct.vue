<template>
  <v-container fluid class="my-3 px-5">
    <ProductForm title="Editar Producto" :productProp="product" />
  </v-container>
</template>

<script>
import ProductForm from "@/components/ProductForm.vue";
import { Product } from "/firebaseAPI/controllers/product.js";

const mProduct = new Product();
export default {
  name: "EditProduct",
  components: {
    ProductForm,
  },
  data() {
    return {
      product: {
        firebaseID: "",
        id_business: 1,
        id_product: 0,
        p_photo: new File([], ""),
        p_name: "",
        p_price: 0,
        p_description: "",
        p_category: "",
        p_status: false,
        p_saved: false,
      },
    };
  },
  async created() {
    const product = await mProduct.readProductWithID(+this.$route.params.id);
    this.product.firebaseID = product.firebaseID;
    this.product.id_business = +product.id_business;
    this.product.id_product = +product.id_product;
    this.product.p_name = product.p_name;
    this.product.p_price = +product.p_price;
    this.product.p_description = product.p_description;
    this.product.p_category = product.p_category;
    this.product.p_status = product.p_status;
    const photoName = await mProduct.readPhotoName(product.p_photo);
    this.product.p_photo = new File([], photoName);
  },
};
</script>


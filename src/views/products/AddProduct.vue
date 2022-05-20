<template>
  <v-container fluid class="my-3 px-5">
    <h2 class="font-weight-bold font-nunito">Nuevo Producto</h2>
    <v-row no-gutters>
      <v-col class="d-none d-sm-flex" cols="2" md="3"></v-col>
      <v-col cols="12" sm="8" md="6" align-self="center">
        <v-form ref="form" lazy-validation class="mt-5 mb-10" v-model="valid">
          <AlertDialog
            :d_title="posts.d_title"
            :d_value="posts.d_value"
            :d_message="posts.d_message"
            :d_cancel="posts.d_cancel"
            :d_accept="posts.d_accept"
            :d_color="posts.d_color"
            :d_icon="posts.d_icon"
            @dialog-accept="acceptButtonDialog(posts.id)"
            @dialog-cancel="posts.d_value = false"
          />

          <v-file-input
            ref="image"
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
            :rules="rules"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Product } from "/firebaseAPI/controllers/product.js";
import AlertDialog from "@/components/Dialog.vue";

export default {
  name: "AddProduct",
  components: {
    AlertDialog,
  },
  data() {
    return {
      posts: {
        id: null,
        d_value: false,
        d_title: "",
        d_message: "",
        d_cancel: "",
        d_accept: "",
        d_color: "",
        d_icon: "",
      },
      dialog: [
        {
          //Dialogo: Tamaño de Imagen
          id: 0,
          d_value: true,
          d_title: "Image Size Exceeded",
          d_message: "Select an image with a smaller size",
          d_cancel: "Ok",
          d_accept: "Ok",
          d_color: "error",
          d_icon: "fa fa-times",
        },
        {
          //Dialogo: (Prueba) Modificar Producto
          id: 1,
          d_value: true,
          d_title: "Edit Product",
          d_message: "Are you sure to edit this product?",
          d_cancel: "Ok",
          d_accept: "Yes, update",
          d_color: "primary",
          d_icon: "fa fa-edit",
        },
      ],
      valid: true,
      rules: [
        (value) =>
          !value || value.size < 2000000 || "El archivo debe ser menor a 2MB",
      ],
      product: {
        id_business: 1,
        id_product: 0,
        p_photo: null,
        p_name: "",
        p_price: 0,
        p_description: "",
        p_category: "",
        p_saved: false,
      },
      items: ["Comida", "Stickers", "Dulces", "Bebidas", "Ropa", "Panaderia"],
    };
  },

  async created() {
    // Validar que el usuario esté loggeado
  },
  methods: {
    async addNewProduct() {
      if (this.$refs.form.validate()) {
        const product = new Product();
        product.addProduct(this.product).then().catch();
      } else {
        // 0 -> Dialogo de imagen grande
        // 1 -> (Prueba) Dialogo editar producto
        this.showDialog(0);
      }
    },
    showDialog(id) {
      this.posts.id = this.dialog[id].id;
      this.posts.d_value = this.dialog[id].d_value;
      this.posts.d_title = this.dialog[id].d_title;
      this.posts.d_message = this.dialog[id].d_message;
      this.posts.d_cancel = this.dialog[id].d_cancel;
      this.posts.d_accept = this.dialog[id].d_accept;
      this.posts.d_color = this.dialog[id].d_color;
      this.posts.d_icon = this.dialog[id].d_icon;
    },
    acceptButtonDialog(id) {
      switch (id) {
        case 0:
          this.$refs.image.reset();
          this.posts.d_value = false;
          break;
        default:
          break;
      }
    },
  },
};
</script>

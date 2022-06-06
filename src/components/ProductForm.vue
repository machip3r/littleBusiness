<template>
  <v-container fluid>
    <div class="d-flex pa-4 align-center">
      <v-btn class="" fab elevation="0" color="primary">
        <v-icon color="secondary" v-on:click="clickBackButton"
          >fas fa-arrow-left</v-icon
        >
      </v-btn>
      <h2 class="font-weight-bold font-nunito ml-8 d-none d-md-inline">
        {{ title }}
      </h2>
      <v-spacer></v-spacer>
      <v-chip class="pa-4" large text-color="secondary" color="primary">
        Stickers Cool
      </v-chip>
      <v-btn
        class="ml-3"
        fab
        elevation="0"
        color="error"
        v-if="editOrAdd"
        v-on:click="showDialog(2)"
      >
        <v-icon color="secondary">fas fa-trash-alt</v-icon>
      </v-btn>
    </div>
    <h2 class="font-weight-bold font-nunito ml-8 d-md-none">{{ title }}</h2>
    <v-row no-gutters class="mt-5">
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
            :disabled="disabled"
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
            :disabled="disabled"
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
            :disabled="disabled"
          ></v-textarea>
          <v-text-field
            v-model="product.p_price"
            label="Precio"
            color="primary"
            background-color="secondary"
            prepend-inner-icon="fas fa-dollar-sign"
            filled
            rounded
            dense
            required
            :disabled="disabled"
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
            :disabled="disabled"
          ></v-select>
          <v-row justify="end" align="center" v-if="editOrAdd">
            <span class="text-h6">Disponible</span>
            <v-checkbox
              v-model="product.p_status"
              hide-details
              class="mt-0 ml-2"
              color="accent"
              :disabled="disabled"
            ></v-checkbox>
          </v-row>
        </v-form>

        <v-footer absolute color="#fff">
          <v-col class="text-center" cols="12">
            <v-btn
              class="px-16"
              label="Add"
              color="error"
              large
              dense
              rounded
              v-on:click="cancelEdit"
              :loading="product.p_saved"
              v-if="editOrAdd && !disabled"
            >
              <div class="mx-10">
                <v-icon left> fas fa-times-circle </v-icon>
                Cancelar
              </div>
            </v-btn>
            <v-btn
              class="px-16 ml-3"
              label="Add"
              color="primary"
              large
              dense
              rounded
              v-on:click="clickFormButton"
              :loading="product.p_saved"
            >
              <div class="mx-10">
                <v-icon left> {{ iconButton }} </v-icon>
                {{ textButton }}
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
  name: "ProductForm",
  props: ["title", "productProp"],
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
          d_title: "Imagen demasiado grande",
          d_message: "Selecciona una imagen más ligera",
          d_cancel: "Ok",
          d_accept: "Ok",
          d_color: "error",
          d_icon: "fa fa-times",
        },
        {
          //Dialogo: (Prueba) Modificar Producto
          id: 1,
          d_value: true,
          d_title: "Editar Producto",
          d_message: "¿Estas seguro de editar este producto?",
          d_cancel: "No, volver",
          d_accept: "Si, Actualizar",
          d_color: "primary",
          d_icon: "fa fa-edit",
        },
        {
          //Dialogo: (Prueba) Modificar Producto
          id: 2,
          d_value: true,
          d_title: "Eliminar Producto",
          d_message: "¿Estas seguro de eliminar este producto?",
          d_cancel: "No, Conservar",
          d_accept: "Si, Eliminar",
          d_color: "error",
          d_icon: "fa fa-edit",
        },
      ],
      valid: true,
      rules: [
        (value) =>
          !value || value.size < 2000000 || "El archivo debe ser menor a 2MB",
      ],
      disabled: false,
      product: {
        firebaseID: "",
        id_business: 1,
        id_product: 0,
        p_photo: null,
        p_name: "",
        p_price: 0,
        p_description: "",
        p_category: "",
        p_status: false,
        p_saved: false,
      },
      items: ["Comida", "Stickers", "Dulces", "Bebidas", "Ropa", "Panaderia"],
    };
  },
  computed: {
    editOrAdd() {
      return this.productProp !== undefined;
    },
    textButton() {
      return this.productProp !== undefined
        ? this.disabled
          ? "Editar"
          : "Guardar"
        : "Agregar";
    },
    iconButton() {
      return this.productProp !== undefined && this.disabled
        ? "fas fa-pen"
        : "fas fa-check";
    },
  },
  created() {
    if (this.productProp !== undefined) {
      this.product = this.productProp;
      this.disabled = true;
    }
  },
  methods: {
    clickFormButton() {
      if (this.editOrAdd) {
        // Editar
        if (!this.disabled) this.showDialog(1);
        if (this.disabled) this.disabled = false;
      } else {
        // Agregar
        this.addNewProduct();
      }
    },
    clickBackButton() {
      this.$router.push({ name: "Dashboard" });
    },
    cancelEdit() {
      this.product = this.productProp;
      this.disabled = true;
    },
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
    async editProduct() {
      if (this.$refs.form.validate()) {
        const product = new Product();
        product.updateProduct(this.product).then().catch();
        this.disabled = true;
      } else {
        // 0 -> Dialogo de imagen grande
        // 1 -> (Prueba) Dialogo editar producto
        this.showDialog(0);
      }
    },
    async deleteProduct() {
      const product = new Product();
      product.deleteProduct(this.product.firebaseID);
      this.clickBackButton();
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
          break;
        case 1:
          this.editProduct();
          break;
        case 2:
          this.deleteProduct();
          break;
        default:
          break;
      }
      this.posts.d_value = false;
    },
  },
};
</script>
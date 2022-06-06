<template>
  <v-container fluid class="my-3 px-5">
    <v-row fluid>
      <v-btn class="" @click="goBack()" fab elevation="0" color="primary">
        <v-icon color="secondary">fas fa-arrow-left</v-icon>
      </v-btn>
      <h2 class="font-weight-bold font-nunito">&nbsp; Add Review</h2>
    </v-row>
    <v-row>
      <v-col class="d-none d-sm-flex" cols="2" md="3"></v-col>
      <v-col cols="7" sm="5" md="4" class="pr-0 ml-2 ml-sm-0 pr-sm-2 pr-md-9 pr-lg-13" align-self="center">
        <v-rating
          v-model="rating"
          color="accent"
          size="70"
          length="5"
        ></v-rating>
      </v-col>
    </v-row>

    <v-row>
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

          <v-textarea
            v-model="review.r_description"
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
          <v-col class="text-center" cols="12">
            <v-btn
              class="px-16"
              label="Add"
              color="primary"
              rows="12"
              x-large
              block
              rounded
              v-on:click="addNewReview"
            >
              <div class="mx-10">
                <v-icon left> fas fa-check </v-icon>
                Agregar
              </div>
            </v-btn>
          </v-col>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Review } from "/firebaseAPI/controllers/review.js";
import AlertDialog from "@/components/Dialog.vue";
import { getAuth } from "firebase/auth";

export default {
  name: "AddProduct",
  components: {
    AlertDialog,
  },
  data() {
    return {
      rating: 1,
      props: {
        star: 3,
        hasresults: true,
        starsize: "lg",
        maxstars: 5,
        disabled: false,
      },
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
      review: {
        id_user: 1,
        id_business: 1,
        r_rate: 1,
        r_description: "",
        r_datetime: "",
        r_status: false,
      },
      items: ["Comida", "Stickers", "Dulces", "Bebidas", "Ropa", "Panaderia"],
    };
  },

  async created() {
    // Validar que el usuario esté loggeado
  },
  methods: {
    getStars(stars) {
      this.star = stars;
    },
    async addNewReview() {
      if (this.$refs.form.validate()) {
        const review = new Review();
        this.review.id_user = getAuth().currentUser.uid;
        this.review.id_business = 1;
        this.review.r_rate = this.rating;
        this.review.r_datetime = this.getDate();
        review.addReview(this.review).then().catch();
        this.$router.push("Review");
      } else {
        // 0 -> Dialogo de imagen grande
        // 1 -> (Prueba) Dialogo editar producto
        this.showDialog(0);
      }
    },
    getDate() {
      const today = new Date();
      const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      const daysOfWeek = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];

      return `${today.getDate()}/${
        months[today.getMonth()]
      }/${today.getFullYear()}`;
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
    goBack() {
      this.$router.back();
    },
  },
};
</script>

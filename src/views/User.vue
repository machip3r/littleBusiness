<template>
  <div class="main-container-user">
    <div class="username-container">
      <h1 class="my-4 mx-4">{{ profile.name }}</h1>
      <v-btn
        class="my-4 mx-4"
        dark
        large
        color="error"
        fixed
        fab
        right
        top
        @click="logOut()"
      >
        <v-icon size="20">fas fa-sign-out-alt</v-icon>
      </v-btn>
    </div>
    <v-container fluid class="secondary py-5">
      <v-row justify="center">
        <v-col cols="10" sm="7" md="4">
          <div class="rounded-circle pa-2 accent">
            <v-img :src="photo" aspect-ratio="1" class="rounded-circle"></v-img>
          </div>
          <v-row justify="end" class="mt-n16">
            <v-col cols="2">
              <v-btn
                elevation="2"
                fab
                x-large
                class="mt-n5 mr-10"
                color="error"
                @click="cancelPhotoChange"
                v-if="modifyPhoto"
              >
                <v-icon>fas fa-times-circle</v-icon></v-btn
              >
            </v-col>
            <v-col cols="4">
              <input
                v-show="false"
                ref="fiPhoto"
                type="file"
                accept="image/png, image/jpeg"
                @change="loadPhoto"
              />

              <v-btn
                elevation="2"
                fab
                x-large
                class="mt-n5"
                :color="modifyPhoto ? 'success' : 'error'"
                @click="uploadPhoto"
              >
                <v-icon>{{
                  modifyPhoto ? "fas fa-check" : "fas fa-camera"
                }}</v-icon></v-btn
              >
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="3">
              <div align="center">
                <v-icon class="mr-2 pb-2">far fa-star</v-icon>
                <h5 class="d-inline">{{ reviews }}</h5>
                <h5>Reseñas</h5>
              </div>
            </v-col>
            <v-col cols="2">
              <h2 align="center">|</h2>
            </v-col>
            <v-col cols="3">
              <div align="center">
                <v-icon class="mr-2 pb-2">fas fa-shopping-bag</v-icon>
                <h5 class="d-inline">{{ orders }}</h5>
                <h5>Compras</h5>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid class="py-5">
      <v-row justify="center">
        <v-col cols="10" sm="7" md="4">
          <h5>Mi información</h5>
          <v-text-field
            class="mt-3"
            v-model="name"
            label="Nombre de usuario"
            color="primary"
            background-color="secondary"
            prepend-inner-icon="far fa-user-circle"
            :append-icon="modifyName ? 'fas fa-pen' : 'fas fa-check'"
            :append-outer-icon="!modifyName ? 'fas fa-times-circle' : ''"
            filled
            rounded
            dense
            required
            solo
            :readonly="modifyName"
            @click:append="updateName"
            @click:append-outer="resetName"
          ></v-text-field>
          <div v-if="profile.type">
            <h5>Mi negocio</h5>

            <v-btn
              class="my-3 px-16 py-6"
              label="Add"
              color="primary"
              large
              block
              rounded
              v-for="item in business"
              :key="item.id_business"
              @click="enterSellerView(item.id_business)"
            >
              <div class="mx-5">
                <v-icon left> fas fa-store </v-icon>
                {{ item.b_name }}
              </div>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      class="fab-back-business mb-15"
      dark
      color="primary"
      fab
      fixed
      right
      bottom
      v-if="user.type"
      @click="openAddBusiness()"
    >
      <v-icon class="icon-back-business" size="15">fas fa-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Business } from "../../firebaseAPI/controllers/business";
import { Review } from "/firebaseAPI/controllers/review.js";
import { Order } from "/firebaseAPI/controllers/order.js";
export default {
  name: "User",
  data() {
    return {
      modifyName: true,
      modifyPhoto: false,
      business: [],
      reviews: 0,
      orders: 0,

      modifiedName: null,
      modifiedPhoto: null,
    };
  },
  computed: {
    ...mapState(["user"]),
    name: {
      get() {
        if (this.modifiedName !== null) return this.modifiedName;
        else if (this.user !== null) return this.user.name;
        return "";
      },
      set(newValue) {
        this.modifiedName = newValue;
      },
    },
    photo: {
      get() {
        if (this.modifiedPhoto !== null)
          return URL.createObjectURL(this.modifiedPhoto);
        else if (this.user !== null) return this.user.photo;
        return "";
      },
      set(newValue) {
        this.modifiedPhoto = newValue;
      },
    },
    profile() {
      if (this.user !== null) return this.user;
      return { name: "", type: false };
    },
  },
  created() {
    this.getUserReviews();
    this.getUserOrders();
    Business.getBussinesByUId(this.user.uid)
      .then((rows) => {
        this.business = rows;
      })
      .catch((err) => {
        //console.error(err);
      });
  },
  methods: {
    ...mapActions([
      "removeAccess",
      "updateUserName",
      "updateUserPhoto",
      "modifyView",
      "activeBusiness",
      "resetOrder",
    ]),

    async getBussines() {},
    async openAddBusiness() {
      //this.$router.push({ name: "Information", params: { id: 468873 } });
      this.$router.push({ name: "AddBusiness" });
    },
    async logOut() {
      this.removeAccess().then(() => {
        this.resetOrder();
        this.$router.push({ name: "Login" });
      });
    },

    async getUserReviews() {
      const R = new Review();
      await R.readUserReviews(this.user.uid).then((res) => {
        const allReviews = R.docsObjectToArray(res);
        this.reviews = allReviews.length;
      });
    },
    async getUserOrders() {
      const O = new Order();
      await O.readUserOrders(this.user.uid).then((res) => {
        const allOrders = O.docsObjectToArray(res);
        this.orders = allOrders.length;
      });
    },

    updateName() {
      if (this.modifyName) this.modifyName = false;
      else if (this.modifiedName != this.user.name) {
        this.updateUserName(this.modifiedName);
        this.modifyName = true;
        this.modifiedName = null;
      }
    },
    resetName() {
      this.modifyName = true;
      this.modifiedName = null;
    },
    loadPhoto(e) {
      this.modifyPhoto = true;
      this.modifiedPhoto = e.target.files[0];
    },
    cancelPhotoChange() {
      this.modifiedPhoto = null;
      this.modifyPhoto = false;
    },
    async uploadPhoto() {
      if (this.modifyPhoto) {
        await this.updateUserPhoto(this.modifiedPhoto);
        this.modifyPhoto = null;
        this.modifiedPhoto = null;
      } else this.$refs.fiPhoto.click();
    },
    enterSellerView(id) {
      this.modifyView(true);
      this.activeBusiness(id);
      this.$router.push({
        name: "Dashboard",
        params: { id: id },
      });
    },
  },
};
</script>

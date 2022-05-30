<template>
  <div class="main-container-user">
    <div class="username-container">
      <h1>Braulio Mac</h1>
      <v-btn dark large color="error" fixed fab right top @click="logOut()">
        <v-icon size="20">fas fa-sign-out-alt</v-icon>
      </v-btn>
    </div>
    <v-container fluid class="secondary py-5">
      <v-row justify="center">
        <v-col cols="10" sm="7" md="4">
          <div class="rounded-circle pa-2 accent">
            <v-img
              src="https://picsum.photos/510/300?random"
              aspect-ratio="1"
              class="rounded-circle"
            ></v-img>
          </div>
          <v-row justify="center">
            <v-col cols="3">
              <div align="center">
                <v-icon class="mr-2 pb-2">far fa-star</v-icon>
                <h5 class="d-inline">10</h5>
                <h5>Reseñas</h5>
              </div>
            </v-col>
            <v-col cols="2">
              <h2 align="center">|</h2>
            </v-col>
            <v-col cols="3">
              <div align="center">
                <v-icon class="mr-2 pb-2">fas fa-shopping-bag</v-icon>
                <h5 class="d-inline">5</h5>
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
            v-model="name"
            label="Nombre de usuario"
            color="primary"
            background-color="secondary"
            prepend-inner-icon="far fa-user-circle"
            append-icon="fas fa-pen"
            filled
            rounded
            dense
            required
            solo
            :readonly="modifyName"
          ></v-text-field>
          <h5>Mi negocio</h5>
          <v-btn class="px-16" label="Add" color="primary" large block rounded>
            <div class="mx-10">
              <v-icon left> fas fa-store </v-icon>
              {{ business }}
            </div>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "User",
  data() {
    return {
      photo: null,
      name: "Braulio Mac",
      modified: false,
      business: "Stickers cool",
      modifyName: true,
    };
  },

  async created() {},

  methods: {
    ...mapActions(["removeAccess"]),
    async logOut() {
      this.removeAccess().then(() => {
        this.$router.push({ name: "Login" });
      });
    },
  },
};
</script>

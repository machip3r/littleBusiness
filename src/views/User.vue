<template>
  <v-container>
    <h1>Usuario</h1>
    <v-btn @click="logOut()" large color="error">Cerrar sesión</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "User",
  data() {
    return {};
  },

  async created() {},

  methods: {
    async logOut() {
      try {
        await this.$store.commit("logOut");
      } catch (error) {
        this.messageError = error;
      }
    },
  },
};
</script>

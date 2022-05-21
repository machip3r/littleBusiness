<template>
  <div class="main-container-user">
    <div class="username-container">
      <h1>Braulio Mac</h1>
      <v-btn dark large color="error" fixed fab right top @click="logOut()">
        <v-icon size="20">fas fa-sign-out-alt</v-icon>
      </v-btn>
    </div>
  </div>
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

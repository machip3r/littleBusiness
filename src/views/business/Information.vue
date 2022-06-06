<template>
  <div class="container-dashboard">
    <v-row class="mt-1 ml-1">
      <v-btn
        class="fab-back-business"
        dark
        color="primary"
        fab
        small
        left
        top
        @click="goBackToProfile()"
      >
        <v-icon class="icon-back-business" size="15">fas fa-arrow-left</v-icon>
      </v-btn>
      <h1 class="ml-5">Información</h1>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Information",
  data() {
    return {};
  },

  methods: {
    async goBackToProfile() {
      this.$router.push({ name: "User" });
    },
  },
};
</script>

<template>
  <v-app>
    <v-main>
      <v-bottom-navigation
        :active.sync="bottomNav"
        :color="color"
        :value="true"
        absolute
        shift
        fixed
        grow
      >
        <v-btn>
          <span>Video</span>
          <v-icon>fas fa-video</v-icon>
        </v-btn>
        <v-btn to="/products">
          <span>Music</span>
          <v-icon>fas fa-music</v-icon>
        </v-btn>
        <v-btn>
          <span>Book</span>
          <v-icon>fas fa-book</v-icon>
        </v-btn>
        <v-btn>
          <span>Image</span>
          <v-icon>fas fa-image</v-icon>
        </v-btn>
      </v-bottom-navigation>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="css">
@import "./styles/main.css";
@import "./styles/login.css";
@import "./styles/user.css";
</style>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<template>
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
</template>

<script>
export default {
  name: "Home",
  data() {
    return {bottomNav: 0};
  },

  methods: {},

  computed: {
    color() {
      switch (this.bottomNav) {
        case 0:
          return "blue-grey";
        case 1:
          return "teal";
        case 2:
          return "brown";
        case 3:
          return "indigo";
        default:
          return "blue-grey";
      }
    },
  },
};
</script>

<style lang="css">
@import "../styles/main.css";
</style>

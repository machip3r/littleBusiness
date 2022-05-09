<template>
  <v-app>
    <v-main>
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

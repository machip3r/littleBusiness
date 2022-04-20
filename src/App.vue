<template>
  <v-app>
    <v-main>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/user">User Template (by Aldo)</router-link> |
        <router-link to="/login">Login</router-link>
      </div>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="css">
@import "./styles/main.css";
@import "./styles/user.css";
</style>

<script>
export default {
  name: "App",
  data() {},
};
</script>

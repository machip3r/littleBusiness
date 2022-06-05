<template>
  <v-app>
    <v-main>
      <router-view />
      <br />
      <br />
    </v-main>
    <BottomNavigationBar :seller="seller" />
  </v-app>
</template>

<style lang="css">
@import "./styles/main.css";
@import "./styles/login.css";
@import "./styles/user.css";
@import "./styles/product.css";
@import "./styles/receipt.css";
@import "./styles/home.css";
@import "./styles/dashboard.css";
</style>

<script>
import BottomNavigationBar from "@/components/BottomNavigationBar";
import { mapActions, mapState } from "vuex";
import { User } from "/firebaseAPI/controllers/user.js";

export default {
  name: "App",

  data: () => ({}),
  computed: {
    ...mapState(["user"]),
    seller() {
      return this.user != null ? this.user.type : null;
    },
  },
  async created() {
    User.getLogedUser().then(async (user) => {
      if (user != null) {
        let doc = await User.getAdditionalDataUser(user.uid);
        let userData = {
          name: user.displayName,
          photo: user.photoURL,
          uid: user.uid,
          type: doc.type,
        };
        this.loadAccess({ user: userData, accessToken: user.accessToken });
        this.$router.push({ name: "Home" });
      }
    });
  },
  components: {
    BottomNavigationBar,
  },
  methods: {
    ...mapActions(["loadAccess"]),
  },
};
</script>

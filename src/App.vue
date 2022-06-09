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
@import "./styles/business.css";
@import "./styles/information.css";
@import "./styles/order.css";
</style>

<script>
import BottomNavigationBar from "@/components/BottomNavigationBar";
import { mapActions, mapState } from "vuex";
import { User } from "/firebaseAPI/controllers/user.js";
import { Business } from "/firebaseAPI/controllers/business.js";

export default {
  name: "App",

  data: () => ({}),
  computed: {
    seller() {
      return this.user != null ? this.user.type : null;
    },
    ...mapState(["user", "sellerView"]),
  },
  async created() {
    this.activeBusiness(+localStorage.getItem("activeBusinessID"));
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
        if (doc.type) {
          let B = new Business();
          let business = await B.readUserBusiness(this.user.uid);
          this.setUserBusiness(B.docsObjectToArray(business));
        }
      }
    });
  },
  components: {
    BottomNavigationBar,
  },
  methods: {
    ...mapActions(["loadAccess", "activeBusiness", "setUserBusiness"]),
  },
};
</script>

<template>
  <div class="login-container">
    <div class="text-mobile">
      <h1 class="title-mobile">Ingresa</h1>
      <p class="subtitle-mobile">
        Accede y disfruta de los productos de la comodidad y a la hora que
        decidas
      </p>
    </div>
    <div class="form-container">
      <h1 class="title-desktop">Ingresa a LittleBusiness</h1>
      <br />
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          label="Correo electrónico"
          color="primary"
          background-color="secondary"
          prepend-inner-icon="fas fa-at"
          :rules="rules.email"
          v-model="email"
          filled
          rounded
          dense
          required
        ></v-text-field>
        <v-text-field
          label="Contraseña"
          color="primary"
          background-color="secondary"
          prepend-inner-icon="fas fa-lock"
          :rules="this.rules.required"
          :append-icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          filled
          rounded
          dense
          required
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <div class="buttons-area">
          <v-btn
            class="button button-login"
            color="accent"
            @click="login()"
            rounded
            dense
            large
          >
            Iniciar Sesión
          </v-btn>
          <v-btn
            @click="loginGoogle()"
            class="button-fab"
            fab
            color="secondary"
          >
            <v-icon color="primary">fab fa-google</v-icon>
          </v-btn>
          <v-btn
            class="button-fab"
            @click="loginFacebook()"
            fab
            color="secondary"
          >
            <v-icon color="primary">fab fa-facebook</v-icon>
          </v-btn>
        </div>
        <div class="login-link-container">
          <p class="login-link-text">
            ¿No tienes cuenta?
            <a class="login-link" href="/signup">Regístrate aquí</a>
          </p>
        </div>
        <v-btn
          class="button button-large"
          color="secondary"
          @click="loginGoogle()"
          rounded
          dense
          large
          ><v-icon left color="primary">fab fa-google</v-icon>
          Iniciar con Google
        </v-btn>
        <v-btn
          class="button button-large"
          color="secondary"
          @click="loginFacebook()"
          rounded
          dense
          large
          ><v-icon left color="primary">fab fa-facebook</v-icon>
          Iniciar con FB
        </v-btn>
        <v-alert
          color="red"
          dismissible
          type="error"
          style="margin-top: 1rem"
          v-model="messageErrorShow"
        >
          {{ messageError }}
        </v-alert>
      </v-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { User } from "/firebaseAPI/controllers/user.js";

export default {
  name: "Login",

  data: () => {
    return {
      email: "",
      password: "",
      showPassword: false,
      valid: true,
      messageErrorShow: false,
      messageError: "",
    };
  },

  computed: {
    ...mapState(["rules"]),
  },

  async created() {},

  methods: {
    async loginFacebook() {
      try {
        let user = await User.loginFacebook(false);

        await this.$store.commit("setSession", user);
        this.$router.push("Home");
      } catch (error) {
        this.messageError = error;
        this.messageErrorShow = true;
      }
    },
    async loginGoogle() {
      try {
        let user = await User.loginGoolge(false);

        await this.$store.commit("setSession", user);
        this.$router.push("Home");
      } catch (error) {
        this.messageError = error;
        this.messageErrorShow = true;
      }
    },

    async login() {
      try {
        let user = await User.login(this.email, this.password);

        await this.$store.commit("setSession", user);
        this.$router.push({ name: "Home" });
      } catch (error) {
        console.log(error);
        if (error) {
          this.messageError = error;
          this.messageErrorShow = true;
        }
      }
    },
  },
};
</script>

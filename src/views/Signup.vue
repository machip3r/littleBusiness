<template>
  <div class="register-container">
    <div class="text-mobile">
      <h1 class="title-mobile">Regístrate</h1>
      <p class="subtitle-mobile">
        Regístrate y sé parte de esta nueva aplicación y su comunidad
      </p>
    </div>
    <div class="form-container-register">
      <h1 class="title-desktop">Regístrate en LB</h1>
      <br />
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          label="Nombre"
          color="primary"
          background-color="secondary"
          prepend-inner-icon="fas fa-user"
          v-model="name"
          filled
          rounded
          dense
          :rules="this.rules.required"
          required
        ></v-text-field>
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
        <v-text-field
          label="Confirma contraseña"
          color="primary"
          background-color="secondary"
          prepend-inner-icon="fas fa-lock"
          :rules="[this.rules.required, passwordRule]"
          :append-icon="showPasswordRepeat ? 'fas fa-eye-slash' : 'fas fa-eye'"
          :type="showPasswordRepeat ? 'text' : 'password'"
          v-model="passwordRepeat"
          filled
          rounded
          dense
          required
          @click:append="showPasswordRepeat = !showPasswordRepeat"
        ></v-text-field>
        <v-switch
          class="switch-seller"
          v-model="seller"
          color="accent"
          inset
          dark
        >
          <template v-slot:label>
            <h6 class="switch-label">¿Eres Vendedor?</h6>
          </template>
        </v-switch>
        <div class="buttons-area">
          <v-btn
            class="button button-register"
            @click="signUp('c')"
            color="accent"
            rounded
            dense
            large
          >
            Sign Up
          </v-btn>
          <v-btn class="button-fab" @click="signUp('g')" fab color="secondary">
            <v-icon color="primary">fab fa-google</v-icon>
          </v-btn>
          <v-btn class="button-fab" @click="signUp('f')" fab color="secondary">
            <v-icon color="primary">fab fa-facebook</v-icon>
          </v-btn>
        </div>
        <div class="login-link-container">
          <p class="login-link-text">
            ¿Ya tienes cuenta?
            <a class="login-link" href="/">Ingresa aquí</a>
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
import { mapState } from "vuex";
import { User } from "../../firebaseAPI/controllers/user";

export default {
  name: "Signup",

  computed: {
    ...mapState(["rules"]),
    passwordRule() {
      return () =>
        this.password.localeCompare(this.passwordRepeat) === 0 ||
        "Las contraseñas no coinciden";
    },
  },

  data: () => {
    return {
      name: "",
      seller: false,
      email: "",
      password: "",
      passwordRepeat: "",
      showPassword: false,
      showPasswordRepeat: false,
      valid: true,
      messageError: "",
      messageErrorShow: false,
    };
  },
  async created() {},

  methods: {
    async signUp(type) {
      if (type == "c") await this.$refs.form.validate();

      if (this.valid) {
        let user = new User(
          this.name,
          "https://previews.123rf.com/images/apollofoto/apollofoto0912/apollofoto091200221/6284572-foto-gen%C3%A9rica-de-hombre-de-negocios.jpg",
          this.seller,
          1,
          this.email,
          this.password
        );

        try {
          let response = await user.createAccountUser(type);
          this.$store.commit("setSession", response);
          if (this.seller) this.$router.push("/addBusiness");
          else this.$router.push("/products");
        } catch (error) {
          this.messageError = error;
          this.messageErrorShow = true;
        }
      }
    },
  },
};
</script>

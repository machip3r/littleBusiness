<template>
  <div class="login-container">
    <div class="form-container">
      <h1>Bienvenido a Little Business</h1>
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
        <v-text-field
          label="Repite la contraseña"
          color="primary"
          background-color="secondary"
          prepend-inner-icon="fas fa-lock"
          :rules="this.rules.required"
          :append-icon="showPasswordRepeat ? 'fas fa-eye-slash' : 'fas fa-eye'"
          :type="showPasswordRepeat ? 'text' : 'password'"
          v-model="passwordRepeat"
          filled
          rounded
          dense
          required
          @click:append="showPasswordRepeat = !showPasswordRepeat"
        ></v-text-field>
        <div class="buttons-area">
          <v-btn class="button" color="accent" rounded dense large>
            Iniciar Sesión
          </v-btn>
          <v-btn class="button-fab" fab color="secondary">
            <v-icon color="primary">fab fa-google</v-icon>
          </v-btn>
          <v-btn class="button-fab" fab color="secondary">
            <v-icon color="primary">fab fa-facebook</v-icon>
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Signup",
  computed: {
    ...mapState(["rules"]),
  },

  data: () => {
    return {
      email: "",
      password: "",
      passwordRepeat: "",
      showPassword: false,
      showPasswordRepeat: false,
      valid: true,
    };
  },

  async created() {},

  methods: {},
};
</script>

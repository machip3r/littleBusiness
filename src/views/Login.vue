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
          :rules="emailRules"
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
          :rules="passwordRules"
          :append-icon="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
          :type="showPassword ? 'text' : 'password'"
          filled
          rounded
          dense
          required
          @click:append="showPassword = !showPassword"
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
export default {
  name: "Login",
  data: () => {
    return {
      showPassword: false,
      rules: [
        (value) => !!value || "Required",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
    };
  },

  async created() {},

  methods: {},
};
</script>

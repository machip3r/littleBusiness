<template>
  <div class="login-container">
    <div class="form-container">
      <h1>Bienvenido a Little Business</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          label="Correo electrónico"
          color="primary"
          background-color="secondary"
          filled
          rounded
          dense
          required
          :rules="emailRules"
        ></v-text-field>
        <v-text-field
          label="Contraseña"
          color="primary"
          background-color="secondary"
          filled
          rounded
          dense
          required
          :rules="passwordRules"
          :append-icon="show3 ? 'fas fa-eye' : 'fas fa-eye-slash'"
          :type="show3 ? 'text' : 'password'"
          @click:append="show3 = !show3"
        ></v-text-field>
      </v-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: () => {
    return {
      show3: false,
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

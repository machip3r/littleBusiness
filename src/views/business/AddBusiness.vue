<template>
  <div>
    <div>
      <h1>Cuéntanos de tu negocio</h1>
      <p>
        ¿Cómo llamarías a tu negocio?, ¿Qué nos puedes decir de él?, ¿Cuál es el
        horario de disponibilidad?
      </p>

      <v-text-field
        filled
        label="Nombre de tu negocio"
        prepend-inner-icon="fas fa-store"
      >
      </v-text-field>
      <v-textarea
        filled
        auto-grow
        prepend-inner-icon="fas fa-comment"
        label="¿Cómo describirías tu negocio?"
        rows="4"
        row-height="30"
      ></v-textarea>
      <p class="font-weight-bold">¿Cuándo está abierto tu negocio?</p>
      <div>
        <div v-for="(day, index) in daysOfWeek" :key="index">
          <div>
            <p>{{ day }}</p>
            <v-text-field></v-text-field>
            <v-text-field></v-text-field>
            <v-btn></v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddBusiness",

  data: () => {
    return {
      daysOfWeek: [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ],
    };
  },

  methods: {},
};
</script>

<style></style>

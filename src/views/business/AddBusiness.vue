<template>
  <div class="container-addBusiness">
    <v-form ref="form" v-model="valid" lazy-validation>
      <div>
        <h1>Cuéntanos de tu negocio</h1>
        <p>
          ¿Cómo llamarías a tu negocio?, ¿Qué nos puedes decir de él?, ¿Cuál es
          el horario de disponibilidad?
        </p>

        <v-text-field
          filled
          label="Nombre de tu negocio"
          prepend-inner-icon="fas fa-store"
          :rules="this.rules.required"
          v-model="b_name"
        >
        </v-text-field>
        <v-textarea
          filled
          auto-grow
          prepend-inner-icon="fas fa-comment"
          label="¿Cómo describirías tu negocio?"
          rows="4"
          v-model="b_description"
          :rules="this.rules.required"
          row-height="30"
        ></v-textarea>
        <v-combobox
          :items="categories"
          item-text="c_name"
          v-model="categorySelected"
          label="Categoria"
          @mouseover="getCategoriesCbx()"
          :rules="this.rules.required"
          filled
        ></v-combobox>
        <p class="font-weight-bold">¿Cuándo está abierto tu negocio?</p>
        <div>
          <v-alert
            color="red"
            dismissible
            type="error"
            style="margin-top: 1rem"
            v-model="messageErrorShow"
          >
            {{ messageError }}
          </v-alert>
          <div v-for="(day, index) in daysOfWeek" :key="index">
            <div class="d-flex align-center-flex">
              <label class="flex-col1">{{ day }}</label>
              <v-text-field
                placeholder="Inicio"
                filled
                rounded
                dense
                v-model="textDays[index].start"
              ></v-text-field>
              <v-text-field
                placeholder="Final"
                filled
                v-model="textDays[index].end"
                rounded
                dense
              ></v-text-field>
              <v-btn
                class="mx-2"
                fab
                dark
                color="indigo"
                @click="addHour(index)"
              >
                <v-icon color="white">fas fa-plus</v-icon>
              </v-btn>
            </div>
            <div class="container-hours">
              <v-chip
                v-for="(item, indexD) in dataDay[index]"
                v-bind:key="indexD"
                close
                color="blue"
                class="chips-hour"
                @click:close="deleteHour(index, indexD)"
              >
                {{ `${item.start}:00 - ${item.end}:00` }}
              </v-chip>
            </div>
          </div>
        </div>
        <div>
          <v-btn
            class="button-continue button button-register"
            rounded
            dense
            large
            @click="addBusiness()"
          >
            <v-icon color="white">fas fa-check</v-icon>
            Continuar
          </v-btn>
        </div>
      </div>
    </v-form>
  </div>
</template>

<style>
.flex-col1 {
  flex-basis: 70%;
}
.align-center-flex {
  align-items: center !important;
  justify-content: center !important;
}
.container-schedule {
  background-color: E4E4E4 !important;
}

.container-hours {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}

.chips-hour {
  color: white !important;
  margin: 0 0.1rem 0.4rem 0.2rem;
}
.button-continue {
  margin-bottom: 1rem;
  background-color: #2d3440 !important;
  color: white !important;
}
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  /* Styles */

  .container-addBusiness {
    margin: 0 5rem 0 5rem;
  }
}

/* Smartphones (landscape) ----------- */
@media only screen and (min-width: 480px) {
  /* Styles */
  .container-addBusiness {
    margin: 0 10rem 0 10rem;
  }
}

/* iPads (portrait and landscape) ----------- */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
  /* Styles */
  .container-addBusiness {
    margin: 0 16rem 0 16rem;
  }
}

@media only screen and (min-device-width: 1024px) and (max-device-width: 1224px) {
  /* Styles */
  .container-addBusiness {
    margin: 0 16rem 0 16rem;
  }
}

/* Desktops and laptops ----------- */
@media only screen and (min-width: 1224px) {
  /* Styles */
  .container-addBusiness {
    margin: 0 25rem 0 25rem;
  }
}

/* Large screens ----------- */
@media only screen and (min-width: 1824px) {
  /* Styles */
}
</style>
<script>
import { mapState } from "vuex";
import { getCategories } from "../../../firebaseAPI/controllers/cateogory";
import { getAuth } from "firebase/auth";
import { Business } from "../../../firebaseAPI/controllers/business";
export default {
  name: "AddBusiness",
  computed: {
    ...mapState(["rules"]),
  },

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
      dataDay: [[], [], [], [], [], [], []],
      textDays: [
        { start: "", end: "" },
        { start: "", end: "" },
        { start: "", end: "" },
        { start: "", end: "" },
        { start: "", end: "" },
        { start: "", end: "" },
        { start: "", end: "" },
      ],
      valid: true,
      messageErrorShow: false,
      messageError: "",
      categories: [],
      categorySelected: "",
      b_name: "",
      b_description: "",
    };
  },

  methods: {
    async getCategoriesCbx() {
      this.categories = await getCategories();
    },
    addHour(index) {
      const hourToAdd = {
        start: this.textDays[index].start,
        end: this.textDays[index].end,
      };

      if (this.validateHour(hourToAdd, index))
        this.dataDay[index].push(hourToAdd);
    },
    deleteHour(index, indexD) {
      this.dataDay[index].splice(indexD, 1);
    },
    validateHour(hourToAdd, index) {
      const end = Number.isInteger(Number(hourToAdd.end))
        ? Number(hourToAdd.end)
        : null;
      const start = Number.isInteger(Number(hourToAdd.start))
        ? Number(hourToAdd.start)
        : null;

      if (!end || !start) {
        this.messageErrorShow = true;
        this.messageError = "Escriba valores correctos";
        return false;
      } else if (end == "" || start == "") {
        this.messageErrorShow = true;
        this.messageError = "Horario vacio";
        return false;
      } else if (end <= 0 || end > 24 || start <= 0 || start > 24) {
        this.messageErrorShow = true;
        this.messageError = "Escriba un horario correcto";
        return false;
      } else if (end - start <= 0) {
        this.messageErrorShow = true;
        this.messageError = "Escriba un horario congruente";
      } else if (this.dataDay[index].length > 0) {
        const finded = this.dataDay[index].some(
          (hour) => end <= hour.end && start >= hour.start
        );

        if (finded) {
          this.messageErrorShow = true;
          this.messageError = "Horas repetidas";
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    async addBusiness() {
      const value = this.$refs.form.validate();
      if (value) {
        let validationDataDay = false;
        this.dataDay.forEach((item) => {
          if (item.length > 0) validationDataDay = true;
        });

        if (validationDataDay) {
          let newBusiness = new Business(
            getAuth().currentUser.uid,
            this.categorySelected.id_category,
            this.b_name,
            this.b_description,
            true,
            JSON.stringify(this.dataDay)
          );

          let result = await newBusiness.create();
          if (result) {
            this.$router.push({ name: "Dashboard" });
          } else {
            this.messageErrorShow = true;
            this.messageError = "No se puedo crear el negocio";
          }
        } else {
          this.messageErrorShow = true;
          this.messageError = "No se introdujeron horarios";
        }
      }
    },
  },
};
</script>

<style></style>

<template>
  <div class="container-addBusiness">
    <v-row class="mt-1 ml-1">
      <v-btn
        class="fab-back-business"
        dark
        color="primary"
        fab
        small
        left
        top
        @click="goBackToInformation()"
      >
        <v-icon class="icon-back-business" size="15">fas fa-arrow-left</v-icon>
      </v-btn>
      <h3 class="ml-5">Editar Negocio</h3>
    </v-row>
    <v-form class="mt-10" ref="form" v-model="valid" lazy-validation>
      <div>
        <v-text-field
          label="Nombre de tu negocio"
          color="primary"
          background-color="secondary"
          prepend-inner-icon="fas fa-store"
          :rules="this.rules.required"
          v-model="b_name"
          filled
          rounded
          dense
          required
        ></v-text-field>
        <v-textarea
          auto-grow
          prepend-inner-icon="fas fa-comment"
          label="Descripción de tu negocio"
          background-color="secondary"
          rows="4"
          v-model="b_description"
          :rules="this.rules.required"
          row-height="30"
          filled
          rounded
          dense
          required
        ></v-textarea>
        <h4>Horario</h4>
        <div>
          <v-snackbar
            class="font-weight-bold"
            :color="snackbarProps.color"
            rounded="pill"
            v-model="snackbarProps.status"
            :timeout="snackbarProps.timeout"
          >
            <v-icon class="mr-6">{{ snackbarProps.icon }}</v-icon>
            <strong>
              {{ snackbarProps.text }}
            </strong>
          </v-snackbar>
          <div v-for="(day, index) in daysOfWeek" :key="index">
            <div class="d-flex align-center-flex">
              <label class="flex-col1">{{ day }}</label>
              <v-text-field
                placeholder="Inicio"
                filled
                rounded
                dense
                @click="openDate(index, true)"
                prepend-inner-icon="fas fa-clock"
                class="schedule-input"
                background-color="secondary"
                v-model="textDays[index].start"
              ></v-text-field>
              <v-text-field
                class="ml-3 schedule-input"
                placeholder="Final"
                filled
                prepend-inner-icon="fas fa-clock"
                background-color="secondary"
                v-model="textDays[index].end"
                @click="openDate(index, false)"
                rounded
                dense
              ></v-text-field>
              <v-btn
                class="button-add-hour"
                elevation="0"
                fab
                @click="addHour(index)"
              >
                <v-icon color="primary" size="18">fas fa-plus</v-icon>
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
                {{ `${item.start} - ${item.end}` }}
              </v-chip>
            </div>
          </div>
        </div>
        <v-btn
          class="mt-15 button-continue button button-register"
          rounded
          dense
          large
          @click="editBusiness()"
        >
          <v-icon class="mr-3" color="white">fas fa-edit</v-icon>
          Editar
        </v-btn>
      </div>
      <v-dialog
        ref="dialog"
        v-model="modal2"
        :return-value.sync="timeTemp"
        persistent
        width="290px"
      >
        <v-time-picker
          format="24hr"
          v-if="modal2"
          v-model="timeTemp"
          full-width
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modal2 = false"> Cancelar </v-btn>
          <v-btn text color="primary" @click="saveDate(timeTemp)">
            Aceptar
          </v-btn>
        </v-time-picker>
      </v-dialog>
    </v-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getAuth } from "firebase/auth";
import { Business } from "../../../firebaseAPI/controllers/business.js";
import { Category } from "../../../firebaseAPI/controllers/category.js";

export default {
  name: "EditBusiness",
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
      b_name: "",
      b_description: "",
      snackbarProps: {
        status: false,
        text: "",
        timeout: 3000,
        icon: "",
      },
      menu2: false,
      modal2: false,
      indexTextDay: 0,
      timeTemp: "",
      isStart: true,
    };
  },

  mounted() {
    const id = this.$route.params.id;

    Business.readBusinessWithID(id).then((business) => {
      this.dataDay = business.b_schedule;
      this.b_name = business.b_name;
      this.b_description = business.b_description;
    });
  },
  methods: {
    openDate(index, isSt) {
      this.indexTextDay = index;
      this.modal2 = true;
      this.timeTemp = "";
      this.isStart = isSt;
    },
    saveDate(datam) {
      if (this.isStart) {
        this.textDays[this.indexTextDay].start = this.timeTemp;
      } else {
        this.textDays[this.indexTextDay].end = this.timeTemp;
      }
      this.modal2 = false;
    },
    async goBackToInformation() {
      this.$router.push({ name: "Information" });
    },
    async getCategoriesCbx() {
      const C = new Category();
      await C.readCategories().then((res) => {
        this.categories = C.docsObjectToArray(res);
      });
    },
    addHour(index) {
      const hourToAdd = {
        start: this.textDays[index].start,
        end: this.textDays[index].end,
      };

      if (this.validateHour(hourToAdd, index)) {
        this.dataDay[index].push(hourToAdd);
        this.clearText(index);
      }
    },
    deleteHour(index, indexD) {
      this.dataDay[index].splice(indexD, 1);
    },
    hourToNumber(hour) {
      const reg = new RegExp("[0-2][0-9][':'][0-5][0-9]");
      if (reg.test(hour.toString())) {
        const tokens = hour.toString().split(":");
        const hourNumber = Number(tokens[0]);
        const minutesNumber = Number(tokens[1]);

        return [hourNumber, minutesNumber];
      } else {
        return -1;
      }
    },

    validateHour(hourToAdd, index) {
      const reg = new RegExp("[0-2][0-9][':'][0-5][0-9]");

      const end = hourToAdd.end.toString().trim();
      const start = hourToAdd.start.toString().trim();

      if (!reg.test(end) || !reg.test(start)) {
        this.snackbarProps.status = true;
        this.snackbarProps.text = "Escriba la hora en formato correcto (hh:mm)";
        return false;
      }
      const endNumber = this.hourToNumber(end);
      const startNumber = this.hourToNumber(start);

      const timeEnd = this.arrayToDate(endNumber);
      const timeStart = this.arrayToDate(startNumber);

      if (timeEnd <= timeStart) {
        this.snackbarProps.status = true;
        this.snackbarProps.text =
          "Horario no correcto, recuerda que el horario de inicio debe ser menor al de salida";
        return false;
      } else {
        if (this.dataDay[index].length > 0) {
          const finded = this.dataDay[index].some((hour) => {
            const hourTempEnd = this.arrayToDate(
              this.hourToNumber(hour.end.toString().trim())
            );
            const hourTempStart = this.arrayToDate(
              this.hourToNumber(hour.start.toString().trim())
            );

            if (
              timeStart < hourTempStart &&
              timeEnd > hourTempStart &&
              timeEnd < hourTempEnd
            ) {
              return true;
            } else if (
              timeStart > hourTempStart &&
              timeStart < hourTempEnd &&
              timeEnd > hourTempEnd
            ) {
              return true;
            } else if (timeStart >= hourTempStart && timeEnd <= hourTempEnd) {
              return true;
            } else {
              return false;
            }
          });

          if (finded) {
            this.snackbarProps.status = true;
            this.snackbarProps.text = "Horarios repetidos o traslapados";
            return false;
          } else {
            return true;
          }
        }
      }
      return true;
    },
    clearText(index) {
      this.textDays[index].end = "";
      this.textDays[index].start = "";
    },

    arrayToDate(arr) {
      let time = new Date();
      time.setHours(arr[0]);
      time.setMinutes(arr[1]);
      time.setSeconds(0);

      return time;
    },
    async editBusiness() {
      const value = this.$refs.form.validate();
      if (value) {
        let validationDataDay = false;
        this.dataDay.forEach((item) => {
          if (item.length > 0) validationDataDay = true;
        });

        if (validationDataDay) {
          let newBusiness = new Business(
            getAuth().currentUser.uid,
            this.b_name,
            this.b_description,
            true,
            JSON.stringify(this.dataDay)
          );

          let result = await newBusiness.update(this.$route.params.id);

          if (result) {
            this.$router.push({
              name: "Information",
              params: { id: this.$route.params.id },
            });
          } else {
            this.snackbarProps.status = true;
            this.snackbarProps.text = "No se pudo actualizar el negocio";
          }
        } else {
          this.snackbarProps.status = true;
          this.snackbarProps.text = "No se introdujeron horarios";
        }
      }
    },
  },
};
</script>

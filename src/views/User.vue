<template>
  <v-app>
    <v-main>
      <div class="pa-8 mx-8">
        <v-card>
          <h2>All Users</h2>
          <v-data-table
            dense
            :headers="headers"
            :items="allUsersArray"
            item-key="user"
          ></v-data-table
        ></v-card>
      </div>
      <div class="pa-8 mx-8">
        <v-card>
          <div class="header">
            <h2>Searched User</h2>
            <v-spacer></v-spacer>
            <div class="d-flex pa-4 align-center">
              <v-text-field v-model="txtFieldID" label="User ID">
              </v-text-field>
              <v-btn @click="searchUserWithID(txtFieldID)">
                <v-icon>fas fa-search</v-icon></v-btn
              >
            </div>
          </div>
          <v-data-table
            dense
            :headers="headers"
            :items="user"
            item-key="user"
            class="elevation-1"
          >
          </v-data-table
        ></v-card>
      </div>

      <div class="d-flex pa-8 mx-8 justify-space-around">
        <v-card class="pa-8" width="40%">
          <h2>Add an User</h2>
          <form @submit.prevent="addNewDocument">
            <v-text-field
              v-model="user[0].u_name"
              label="Nombre"
            ></v-text-field>
            <v-text-field
              v-model="user[0].u_type"
              label="Tipo de usuario"
            ></v-text-field>
            <v-text-field
              v-model="user[0].u_status"
              label="Estado"
            ></v-text-field>
            <v-btn type="submit">Agregar usuario</v-btn>
          </form></v-card
        >
        <v-card class="pa-8" width="40%">
          <h2>Edit an User</h2>
          <form @submit.prevent="updateDocument(queryRes)">
            <v-text-field
              v-model="queryRes[0].u_name"
              label="Nombre"
            ></v-text-field>
            <v-text-field
              v-model="queryRes[0].u_type"
              label="Tipo de usuario"
            ></v-text-field>
            <v-text-field
              v-model="queryRes[0].u_status"
              label="Estado"
            ></v-text-field>
            <v-btn type="submit">Editar usuario</v-btn>
          </form>
        </v-card>
      </div>
      <div class="form"></div>
    </v-main>
  </v-app>
</template>

<script>
// Import the functions you need from the SDKs you need
import { User } from "/firebaseAPI/controllers/user.js";

const UserClass = new User();

export default {
  name: "User",
  data() {
    return {
      headers: [
        { text: "Firebase Key", value: "firebaseID" },
        { text: "User ID", value: "id_user" },
        { text: "Name", value: "u_name" },
        { text: "Status", value: "u_status" },
        { text: "Type", value: "u_type" },
      ],
      txtFieldID: 0,
      allUsers: {},
      allUsersArray: [],
      keys: [],
      user: [
        {
          firebaseID: "",
          id_user: 0,
          u_name: "",
          u_type: "",
          u_status: "",
        },
      ],
      queryRes: [
        {
          id_user: 0,
          u_name: "",
          u_type: "",
          u_status: "",
        },
      ],
    };
  },

  async created() {
    await UserClass.readUsers().then((res) =>
      Object.assign(this.allUsers, res)
    );

    this.allUsersArray = UserClass.docsObjectToArray(this.allUsers);
    this.keys = Object.keys(this.allUsers);
  },

  methods: {
    async readDocuments() {
      await UserClass.readUsers()
        .then((res) => {
          this.allUsers = res;
        })
        .catch((err) => console.error(err));
    },

    async addNewDocument() {
      console.log(this.user);
      UserClass.addUser(this.user)
        .then((res) => console.log("Created succesfully"))
        .catch((err) => console.log("Error", err));
      await this.readDocuments();
    },

    async searchUserWithID(id) {
      await UserClass.readUserWithID(+id)
        .then((res) => {
          this.queryRes = UserClass.docsObjectToArray(res);
          this.user = this.queryRes;
        })
        .catch();

      console.log("queryRes: ", this.queryRes);
      console.log("user: ", this.user);
    },

    async updateDocument(body) {
      const firebaseID = body[0].firebaseID;
      delete body[0].firebaseID;

      UserClass.updateUser(firebaseID, body[0])
        .then((res) => {
          console.log("Updated Successfully");
        })
        .catch((err) => {
          console.log("Error while updating: ", err);
        });
    },
  },
};
</script>

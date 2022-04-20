<template>
  <v-app>
    <v-main>
      <div>
        <h2>All Users</h2>
        <table class="myTable">
          <thead>
            <tr>
              <th>Firebase Key</th>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="key in keys" v-bind:key="key">
              <td>{{ key }}</td>
              <td>{{ allUsers[key].id_user }}</td>
              <td>{{ allUsers[key].u_name }}</td>
              <td>{{ allUsers[key].u_type }}</td>
              <td>{{ allUsers[key].u_status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div class="header">
          <h2>Searched User</h2>
          <div class="input">
            <input
              type="number"
              placeholder="User ID to look for"
              v-model="txtFieldID"
            />
            <button v-on:click="searchUserWithID(txtFieldID)">
              Search con este puto ID joto
            </button>
          </div>
        </div>
        <table class="myTable">
          <thead>
            <tr>
              <th>Firebase Key</th>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ user.firebaseID }}</td>
              <td>{{ user.id_user }}</td>
              <td>{{ user.u_name }}</td>
              <td>{{ user.u_type }}</td>
              <td>{{ user.u_status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="form">
        <h2>Add a wey</h2>
        <form id="form" v-on:submit.prevent="addNewDocument">
          <div>
            <label for="username"></label>
            <input
              type="text"
              id="username"
              placeholder="username"
              v-model="user.u_name"
            />
          </div>
          <div>
            <label for="usertype"></label>
            <input
              type="text"
              id="usertype"
              placeholder="user type"
              v-model="user.u_type"
            />
          </div>
          <div>
            <label for="userstatus"></label>
            <input
              type="text"
              id="userstatus"
              placeholder="user status"
              v-model="user.u_status"
            />
          </div>
          <input type="submit" value="Agregar mono" />
        </form>
      </div>
      <div class="form">
        <h2>Edit a wey</h2>
        <form id="form" v-on:submit.prevent="updateDocument(user)">
          <div>
            <label for="username"></label>
            <input
              type="text"
              id="username"
              placeholder="username"
              v-model="user.u_name"
            />
          </div>
          <div>
            <label for="usertype"></label>
            <input
              type="text"
              id="usertype"
              placeholder="user type"
              v-model="user.u_type"
            />
          </div>
          <div>
            <label for="userstatus"></label>
            <input
              type="text"
              id="userstatus"
              placeholder="user status"
              v-model="user.u_status"
            />
          </div>
          <input type="submit" value="Edita al mono" />
        </form>
      </div>
    </v-main>
  </v-app>
</template>

<script>
// Import the functions you need from the SDKs you need
import {User} from "/firebaseAPI/controllers/user.js";

const UserClass = new User();

export default {
  name: "User",
  data() {
    return {
      txtFieldID: 0,
      allUsers: {},
      keys: [],
      user: {
        id: "",
        id_user: 0,
        u_name: "",
        u_type: "",
        u_status: "",
      },
      queryRes: {
        id_user: 0,
        u_name: "",
        u_type: "",
        u_status: "",
      },
    };
  },

  async created() {
    await UserClass.readUsers().then((res) =>
      Object.assign(this.allUsers, res)
    );

    this.keys = Object.keys(this.allUsers);
  },

  methods: {
    async readDocuments() {
      UserClass.readUsers()
        .then((res) => {
          this.allUsers = res;
        })
        .catch((err) => console.error(err));
    },

    async addNewDocument() {
      console.log(this.user);
      UserClass.addUser(this.user).then();
    },

    async searchUserWithID(id) {
      UserClass.readUserWithID(+id)
        .then((res) => {
          const userID = Object.keys(res)[0];
          this.queryRes = res[userID];
          this.user = this.queryRes;

          Object.assign(this.user, {firebaseID: userID});
        })

        .catch();
    },

    async updateDocument(body) {
      const firebaseID = body.firebaseID;
      delete body.firebaseID;

      UserClass.updateUser(firebaseID, body)
        .then((res) => {
          console.log("Updated Successfully");
          this.readDocuments();
        })
        .catch((err) => {
          console.log("Error while updating: ", err);
        });
    },
  },
};
</script>

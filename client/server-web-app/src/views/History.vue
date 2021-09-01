<template>
  <div>
    <div class="control-column" id="control-column">
      <div class="avatar px-2 py-2 d-flex align-center mx-2">
        <v-avatar
          color="#ed3990"
          size="43"
          class="text-uppercase white--text font-weight-bold text-h5"
          >{{ image }}
        </v-avatar>
        <div class="mx-3">
          <div class="font-weight-bold mt-0 mb-1 overflow-text">
            {{ username }}
          </div>
          <div class="my-0 overflow-text">{{ email }}</div>
        </div>
      </div>

      <p class="mx-3 font-weight-bold">Manage</p>

      <v-divider />

      <p
        class="text-capitalize mt-3 manage-items effect-2 px-3 py-2"
        @click="logOut"
      >
        <i class="fas fa-sign-out-alt me-1" style="color: #ed3990"></i>
        <span class=""> Log Out </span>
      </p>
    </div>

    <div class="server-column pa-8">
      <div>
        <router-link to="/server">
          <i class="fas fa-home fa-2x"></i>
        </router-link>
      </div>
      <v-data-table
        :headers="headers"
        :items="history"
        class="elevation-1 mt-4"
      >
      </v-data-table>
    </div>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      <span style="color: white !important">
        {{ text }}
      </span>

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import allServerServices from "../services/servers";

export default {
  data() {
    return {
      headers: [
        { text: "Port", value: "port_old" },
        { text: "Status", value: "status_old" },
        { text: "Username", value: "username_old", sortable: false },
        { text: "Password", value: "password_old", sortable: false },
        { text: "Change Time", value: "change_time", sortable: false },
      ],
      history: [{}],
      snackbar: false,
      timeout: 2000,
      text: "",
      image: "h",
    };
  },
  computed: {
    username: function () {
      return this.$store.state.auth.user.username;
    },
    email: function () {
      return this.$store.state.auth.user.email;
    },
  },

  created: function () {
    this.getHistoryData(this.$route.params.serverId);
  },
  
  methods: {
    logOut: function () {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },

    getHistoryData(id) {
      const user = JSON.parse(localStorage.getItem("user"));
      allServerServices
        .getHistory(user, id)
        .then((response) => {
          this.history = JSON.parse(response.data).data.map((item) => {
            item["change_time"] = item["change_time"]
              .split("T")
              .join(" // At: ");

            if (item.status_old === true) item.status = "On";
            else if (item.status_old === false) {
              item.status_old = "Off";
            }

            return item;
          });
        })
        .catch((error) => {
          this.snackbarInform(
            (error.response && error.response.data.message) || error.message
          );
        });
    },

    snackbarInform(message) {
      this.snackbar = true;
      this.text = message;
    },
  },
};
</script>
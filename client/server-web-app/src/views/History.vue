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
      <div class="d-flex justify-space-between">
        <v-dialog v-model="dialog" persistent max-width="290">
          <template v-slot:activator="{ on, attrs }">
            <div class="ma-3 d-flex">
              <button
                v-bind="attrs"
                v-on="on"
                class="text-capitalize primary-button text-subtitle-2"
              >
                <span>Add Filter</span>
                <i class="fas fa-plus ms-2"></i>
              </button>

              <div class="mx-3 text-subtitle-2 chip" v-if="displayFrom">
                <span>From: {{ start_date }}</span>
                <i
                  class="fas fa-times ms-2"
                  @click="deleteFilter('displayFrom')"
                ></i>
              </div>

              <div class="mx-3 text-subtitle-2 chip" v-if="displayTo">
                <span>To: {{ end_date }}</span>
                <i
                  class="fas fa-times ms-2"
                  @click="deleteFilter('displayTo')"
                ></i>
              </div>
            </div>
          </template>
          <v-card>
            <v-card-title class="text-h6 font-weight-bolf">
              Select Filter
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p class="me-3 font-weight-medium">Date:</p>
              <div>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="start_date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="start_date"
                      label="Picker Start Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="start_date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="
                        $refs.menu.save(start_date);
                        displayFrom = start_date;
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>

                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="end_date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="end_date"
                      label="Picker End Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="end_date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu2 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="
                        $refs.menu2.save(end_date);
                        displayTo = end_date;
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">
                Cancel
              </v-btn>
              <v-btn color="green darken-1" text @click="navigationFunction()">
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <div>
          <router-link to="/view-server">
            <i class="fas fa-home fa-2x"></i>
          </router-link>
        </div>
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
      end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      start_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      displayFrom: null,
      displayTo: null,
      menu: false,
      menu2: false,
      dialog: false,
    };
  },
  computed: {
    username: function () {
      return JSON.parse(localStorage.getItem("user")).username;
    },
    email: function () {
      return JSON.parse(localStorage.getItem("user")).email;
    },
    image: function () {
      return JSON.parse(localStorage.getItem("user")).username[0];
    },
  },

  created: function () {
    this.getHistoryData(
      this.$route.params.serverId,
      this.displayFrom,
      this.displayTo
    );
  },

  watch: {
    $route: function () {
      this.getHistoryData(
        this.$route.params.serverId,
        this.displayFrom,
        this.displayTo
      );
    },
  },

  methods: {
    logOut: function () {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },

    getHistoryData(id, start, end) {
      const user = JSON.parse(localStorage.getItem("user"));
      allServerServices
        .getHistory(user, id, start, end)
        .then((response) => {
          if(response.obj.data) {
              this.history = response.obj.data.map((item) => {
            item["change_time"] = item["change_time"]
              .split("T")
              .join(" // At: ");

            if (item.status_old === true) item.status_old = "On";
            else if (item.status_old === false) {
              item.status_old = "Off";
            }

            return item;
          });
          } else {
            this.history = []
          }
          
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

    navigationFunction() {
      this.dialog = false;
      let query = {
        start: this.displayFrom,
        end: this.displayTo,
      };

      Object.keys(query).forEach(
        (key) => query[key] === null && delete query[key]
      );

      this.$router.push({
        path: `/view-history/${this.$route.params.serverId}`,
        query: query,
      }).catch(()=>{
      });
    },

    deleteFilter(filter) {
      this[filter] = null;
      this.navigationFunction();
    },
  },
};
</script>
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
        <div class="">
          <input
            type="text"
            placeholder="Type IP to search"
            v-model="searchcontent"
            class="input"
          />
          <i
            class="fas fa-search ms-n6 effect-1"
            @click="navigationFunction()"
          ></i>
        </div>
        <div>
          <p @click="homeFunction()">
            <i class="fas fa-home fa-2x"></i>
          </p>
        </div>
      </div>

      <div class="mt-6 d-flex justify-space-between align-center">
        <h2 class="text-capitalize">Servers Management</h2>
        <div class="">
          <v-dialog v-model="dialogServer" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <button
                v-bind="attrs"
                v-on="on"
                class="
                  text-capitalize
                  mx-3
                  my-1
                  secondary-button
                  text-subtitle-2
                "
              >
                Add Server
              </button>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5 font-weight-bold">Server information</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Port"
                        required
                        v-model="data.port"
                        :rules="portRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <!--validate password-->
                      <v-text-field
                        label="IP address"
                        required
                        v-model="data.ip"
                        :rules="IPrules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Username"
                        required
                        v-model="data.username"
                        :rules="generalRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Password"
                        required
                        v-model="data.password"
                        :rules="generalRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Description"
                        type="text"
                        required
                        v-model="data.description"
                        :rules="generalRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogServer = false">
                  Close
                </v-btn>
                <v-btn color="blue darken-1" text @click="createFunction(data)">
                  Create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <button class="primary-button text-subtitle-2" @click="exportXLSX()">
            Export File
          </button>
        </div>
      </div>

      <v-row class="mt-1 justify-space-between align-center">
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

              <div
                class="mx-3 text-subtitle-2 chip"
                v-if="statusFilter !== null"
              >
                <span>Status: {{ statusFilter ? "On" : "Off" }}</span>
                <i
                  class="fas fa-times ms-2 effect-1"
                  @click="deleteFilter('statusFilter')"
                ></i>
              </div>

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
              <p class="me-3 font-weight-medium">Status:</p>
              <div>
                <v-radio-group v-model="statusFilter">
                  <v-radio :label="'On'" :value="true"></v-radio>
                  <v-radio :label="'Off'" :value="false"></v-radio>
                </v-radio-group>
              </div>
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
              <v-btn color="green darken-1" text @click="dialog = !dialog">
                Cancel
              </v-btn>
              <v-btn color="green darken-1" text @click="navigationFunction()">
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <div class="me-5 font-italic">{{ servers.length }} results</div>
      </v-row>

      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="servers"
        item-key="_id"
        show-select
        class="elevation-1 mt-4"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                v-bind="attrs"
                v-on="on"
                @click="addIdFunc(item)"
                class="mx-1"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>

          <v-tooltip bottom class="mx-1">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                v-bind="attrs"
                v-on="on"
                @click="statusFunction(item)"
                class="mx-1"
              >
                mdi-access-point
              </v-icon>
            </template>
            <span>Get Status</span>
          </v-tooltip>

          <v-tooltip bottom class="mx-2">
            <template v-slot:activator="{ on, attrs }">
              <i
                small
                v-bind="attrs"
                v-on="on"
                class="fas fa-history text--black mx-1"
                @click="
                  $router.push({
                    name: 'History',
                    params: { serverId: item._id },
                  })
                "
              ></i>
            </template>
            <span>History</span>
          </v-tooltip>

        </template>
      </v-data-table>

      <v-dialog v-model="progress" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Check server status
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

    <v-overlay :z-index="10" :value="updateInforBox">
      <v-card max-width="600">
        <v-card-title>
          <span class="text-h5 font-weight-bold mx-4">Update information</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6" sm="6" md="4">
                <v-text-field
                  label="Port"
                  required
                  v-model="dataUpdate.port"
                  :rules="portRules"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Username"
                  required
                  v-model="dataUpdate.username"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Password"
                  required
                  v-model="dataUpdate.password"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Description"
                  type="text"
                  required
                  v-model="dataUpdate.description"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="updateInforBox = false">
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updateFunction(dataUpdate, updateId)"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

    <div class="select-noti">
      <div class="d-flex justify-space-between px-4 align-center">
        <p class="font-weight-medium text-subtitle-2">
          {{ selected.length }} selected
        </p>
        <div class="">
          <button
            class="primary-button text-subtitle-2"
            @click="deleteFunction(selected)"
          >
            Delete
          </button>
          <span class="font-italic mx-3">Or</span>
          <button class="primary-button text-subtitle-2" @click="selected = []">
            Clear Selection
          </button>
        </div>
      </div>
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
      progress: false,
      searchcontent: "",
      snackbar: false,
      dialog: false,
      dialogServer: false,
      collapse: false,
      statusFilter: null,
      selected: [],
      updateInforBox: false,
      headers: [
        {
          text: "IP address",
          align: "start",
          sortable: false,
          value: "IP",
        },
        { text: "Port", value: "port" },
        { text: "Status", value: "status" },
        { text: "Description", value: "description", sortable: false },
        { text: "Username", value: "username", sortable: false },
        { text: "Password", value: "password", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
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
      data: {},
      dataUpdate: {},
      IPrules: [
        (v) =>
          /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/.test(v) ||
          "IP not valid",
      ],
      generalRules: [(v) => !!v || "required"],
      portRules: [
        (v) => (+v < 65536 && +v > 0 ? true : false || "Port not valid"),
      ],
      servers: [],
      text: "",
      timeout: 2000,
      updateId: "",
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
    //get server info from server
        this.getData();
  },

  watch: {
    $route: function () {
      if (Object.getOwnPropertyNames(this.$route.query).length === 0) {
        this.getData();
      } else {
        this.searchFunction();
      }
    },
  },

  methods: {
    logOut: function () {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },

    createFunction(server) {
      const user = JSON.parse(localStorage.getItem("user"));
      allServerServices
        .create(user, server)
        .then(() => {
          this.snackbarInform("Server Created Successfully");
          this.getData();
        })
        .catch((error) => {
          this.snackbarInform(
            (error.response && error.response.data.message) || error.message
          );
        });
      this.dialogServer = false;
    },

    deleteFunction(array) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (array.length > 0) {
        array = array.map(item => item._id);
        allServerServices
          .delete(user, array)
          .then( () => {
            this.snackbarInform("Server Deleted Successfully");
            this.servers = this.servers.filter( item => {
              return !array.includes(item._id);
            });
          })
          .catch((error) => {
            this.snackbarInform(
              (error.response && error.response.data.message) || error.message
            );
          });
          this.selected = []
      } else {
        this.snackbarInform("No selection");
      }
    },

    statusFunction(item) {
      const user = JSON.parse(localStorage.getItem("user"));
      this.progress = true;
      this.snackbarInform("Please wait");
      allServerServices
        .getStatus(user, item._id)
        .then((response) => {
          this.progress = false;
          item.status = response.obj.status;
          this.snackbarInform(
            `Status: ${response.obj.status} - ${response.obj.level || ""}`
          );
        })
        .catch((err) => {
          this.progress = false;
          this.snackbarInform(err);
        });
    },

    searchFunction() {
      const user = JSON.parse(localStorage.getItem("user"));
      let obj = this.$route.query;
      allServerServices
        .search(user, obj)
        .then((response) => {
          this.servers = response.obj.server.map((item) => {
            if (item.status === true) item.status = "On";
            else item.status = "Off";
            return item;
          });
          this.dialog = false;
        })
        .catch((error) => {
          this.snackbarInform(
            (error.response && error.response.data.message) || error.message
          );
          this.dialog = false;
        });
    },

    exportXLSX() {
      const user = JSON.parse(localStorage.getItem("user"));
      allServerServices
        .exportXLSX(user)
        .then((response) => {
          var hiddenElement = document.createElement("a");
          const url = window.URL.createObjectURL(response.data);
          hiddenElement.href = url;
          hiddenElement.download = "Data.xlsx";
          hiddenElement.click();
          this.snackbarInform("Download Successfully");
        })
        .catch((error) => {
          this.snackbarInform(
            (error.response && error.response.data.message) || error.message
          );
        });
    },

    updateFunction(data, id) {
      const user = JSON.parse(localStorage.getItem("user"));
      allServerServices
        .update(user, data, id)
        .then(() => {
          this.getData();
        })
        .catch((error) => {
          this.snackbarInform(
            (error.response && error.response.data.message) || error.message
          );
        });
    },

    getData() {
      const user = JSON.parse(localStorage.getItem("user"));
      allServerServices
        .getDataFunction(user.token)
        .then((response) => {
          this.servers = JSON.parse(response.data).servers.map((item) => {
            if (item.status === true) item.status = "On";
            else item.status = "Off";
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

    addIdFunc(item) {
      this.updateInforBox = true;
      this.updateId = item._id;
    },

    navigationFunction() {
      this.dialog = false;
      this.$router.push({
        path: "/server",
        query: {
          q: this.searchcontent,
          start: this.displayFrom,
          end: this.displayTo,
          status: this.statusFilter,
        },
      });
    },

    homeFunction() {
      this.$router.push({
        path: "/server",
      });
      this.displayFrom = null;
      this.displayTo = null;
      this.statusFilter = null;
      this.searchcontent = null;
    },

    deleteFilter(filter) {
      this[filter] = null;
      this.navigationFunction();
    },
  },
};
</script>

<style>
.select-noti {
  position: fixed;
  width: 60%;
  margin: 10px 11% 0 29%;
  bottom: 0%;
  border-right: 3px solid #9c9a9a;
  border-top: 3px solid #9c9a9a;
  border-left: 3px solid #9c9a9a;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 10px 15px;
}

.primary-button {
  border-radius: 5px;
  border: 2px solid #9c9a9a;
  padding: 6px 15px;
  font-weight: 500 !important;
}

.primary-button:hover *,
.primary-button:hover {
  color: #0115898e;
}

.secondary-button {
  background-color: #378af4;
  padding: 6px 15px;
  color: white;
  border-radius: 5px;
  border: 2px solid #378af4;
}

.secondary-button:hover {
  background-color: #1c70dd;
}

.chip::before {
  width: 100%;
  content: "";
  height: 2px;
  background: #011589;
  display: block;
  position: absolute;
  top: 70%;
}

.chip {
  position: relative;
  padding: 2px;
}

.chip span {
  position: relative;
}

.chip span::before {
  width: 67%;
  content: "";
  height: 1.5px;
  background: #011589;
  display: block;
  position: absolute;
  top: 160%;
}

.control-column {
  background-color: #f1f4f9;
  position: fixed;
  height: 100%;
  width: 18%;
}

.modify-server {
  font-size: 14px;
  font-weight: 450;
}

.manage-items {
  cursor: pointer;
  font-size: 15px;
  font-weight: 450;
}

.title-cell {
  background: #f1f4f9;
  border-radius: 5px;
}

.title-cell div {
  color: #838a94;
}

.effect-1::after {
  content: "";
  height: 2px;
  width: 0%;
  transition: width 1s;
  background: #011589;
  display: block;
}

.effect-1:hover::after {
  width: 100%;
}

.effect-2:hover {
  background-color: #e2e9f1;
}

.server-column {
  margin-left: 18%;
  position: relative;
}

.input {
  padding: 6px;
  font-size: 13px;
  border: 2px solid rgba(0, 0, 0, 0.363) !important;
  border-radius: 5px !important;
  color: #011589;
  width: 400px !important;
}

.input:focus {
  outline: none;
}

.avatar {
  background-color: #e4e8f1;
  margin: 20px auto;
  border-radius: 10px;
}

.avatar > div {
  width: 80%;
}

.control-header {
  background-color: transparent !important;
  outline: none !important;
  border: none !important;
}

.overflow-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

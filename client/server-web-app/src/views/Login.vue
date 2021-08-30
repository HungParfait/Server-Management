<template>
  <div class="login-form">
    <div class="inside pa-10 rounded-lg">
      <h2 class="text-center pt-4 pb-5">Welcome back</h2>
      <p class="grey--text lighten-1 text-center">
        Please fill with your information
      </p>
      <v-form @submit.prevent="loginFunc">
        <v-container>
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="E-mail"
            required
            class="my-3"
          >
            <v-icon slot="prepend" color="primary"> mdi-email </v-icon>
          </v-text-field>

          <v-text-field
            v-model="user.password"
            :rules="passwordRules"
            label="Password"
            required
            type="password"
          >
            <v-icon slot="prepend" color="primary"> mdi-lock </v-icon>
          </v-text-field>
          <p class="text-center">
            <v-btn
              color="primary"
              depressed
              elevation="4"
              outlined
              class="mb-3 mt-5"
              type="submit"
            >
              <span v-show="!loading">Đăng nhập</span>
              <span v-show="loading">Loading ...</span>
            </v-btn>
          </p>
        </v-container>
      </v-form>
      <p class="font-weight-medium text--red">{{ message }}</p>
      <p class="text-center text-sm-body-2 font-italic">Or</p>
      <p class="text-center mt-3">
        <router-link to="/register" class="router-link">Sign Up</router-link>
      </p>
    </div>
    <template>
      <div class="text-center">
        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ $store.messageFromServer }}
          <template v-slot:action="{ attrs }">
            <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </template>
  </div>
</template>

<script>
import User from "../helper/UserModel";

export default {
  data: () => ({
    snackbar: false,
    timeout: 2000,
    loading: false,
    user: new User(),
    message: "",
    passwordRules: [(v) => !!v || "required"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
  }),

  computed: {
    created() {
      if (this.loggedIn) {
        this.$router.push("/server");
      }
    },
  },

  methods: {
    loginFunc: function () {
      if (this.user.email && this.user.password) {
        this.loading = true;
        this.$store.dispatch("login", this.user)
          .then((user) => {
            localStorage.setItem('user',user)
            this.$router.push("/server");
          })
          .catch(error => {
            this.loading = false;
            this.message =
              (error.response && error.response.data.message) || error.message;
          });
      }
    },
  },
};
</script>

<style>
.login-form {
  background-image: url("../../public/image/bg-01.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  width: 100%;
  height: 100%;
}
.inside {
  width: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
}

.router-link {
  text-decoration: none;
}

input {
  width: 250px !important;
}
</style>

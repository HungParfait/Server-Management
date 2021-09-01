<template>
  <div class="login-form">
    <div class="inside pa-8 py-6 rounded-lg">
      <h2 class="text-center pt-4 pb-5">Welcome</h2>
      <p class="grey--text lighten-1 text-center my-0">
        Please fill with your information
      </p>
      <v-form @submit.prevent="registerFunc">
        <v-container>
          <v-text-field
            v-model="user.username"
            :rules="usernameRules"
            label="Username"
            required
            class="my-3"
          >
            <i class="far fa-user" slot="prepend" color="primary"></i>
          </v-text-field>
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

          <transition name="fade">
            <small v-if="isValid" class="input-alert">
              Must contain number, lowercase, uppercase, special character and
              be at least 6 characters, less than 8 characters
            </small>
          </transition>

          <v-text-field
            v-model="repeatPassword"
            label="Repeat Password"
            required
            :messages="[isRepeat === true ? 'Do not match' : '']"
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
              <span v-show="!loading">Đăng kí</span>
              <span v-show="loading">Loading ...</span>
            </v-btn>
          </p>
        </v-container>
      </v-form>
      <p>{{ message }}</p>
      <p class="text-center text-sm-body-2 font-italic my-0">Or</p>
      <p class="text-center mt-3">
        <router-link to="Login" class="router-link">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import User from "../helper/UserModel";

export default {
  data: () => ({
    message: "",
    loading: false,
    repeatPassword: "",
    user: new User("", "",""),
    passwordRules: [(v) => !!v || "required"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    usernameRules: [
      (v) => !!v || "required",
      (v) => (v.length <= 10 && v.length >= 3) || "Length:  3 - 10 characters",
    ],
  }),

  computed: {
    isRepeat: function () {
      return this.repeatPassword
        ? !(this.repeatPassword === this.user.password)
        : this.repeatPassword === this.user.password;
    },
    isValid: function () {
      return this.user.password
        ? !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,8}$/.test(
            this.user.password
          )
        : false;
    },
    created() {
      if (this.loggedIn) {
        this.$router.push("/server");
      }
    },
  },

  created: function() {
      if (this.$store.state.auth.status.loggedIn) {
        this.$router.push("/view-server");
      }
  },

  methods: {
    registerFunc: function () {
      if (this.user.username && this.user.password && this.user.email) {
        this.loading = true;

        this.$store.dispatch("register", this.user).then(
          () => {
            this.$router.push("/view-server");
          })
          .catch(error => {
            this.loading = false;
            this.message =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
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

.input-alert {
  display: block;
  width: 300px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <v-app :dark="isAdminLogin">
    <v-layout wrap align-center justify-space-around column>
      <v-flex xs12 md3>
        <v-container>
          <v-layout align-center justify-center row>
            <img :src="getImage()">
            <br>
          </v-layout>
          <v-layout column align-content-space-around>
            <v-card-title
              v-if="!isAdminLogin"
              class="title font-weight-light"
            >Log in to your faculty account</v-card-title>
            <v-card-title
              v-if="isAdminLogin"
              class="title font-weight-light"
            >Log in to your admin account</v-card-title>

            <br>
            <v-form ref="form">
              <v-text-field
                :rules="usernameRule"
                v-model="username"
                box
                label="Username"
                type="text"
                required
              />
              <v-text-field
                :rules="passwordRule"
                v-model="password"
                box
                label="Password"
                type="password"
                required
              />
              <v-btn block color="primary" :loading="isBtnLoading" @click="handleLogin">LOG IN</v-btn>
              <br>
              <v-btn block flat @click="toggleLogin()" v-if="!isAdminLogin">Switch to Admin Login</v-btn>
              <v-btn block flat @click="toggleLogin()" v-if="isAdminLogin">Switch to Faculty Login</v-btn>
            </v-form>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-footer>
      <v-spacer></v-spacer>
      <div>
        Developed by the
        <b>CS Entry</b> team
      </div>
      <v-spacer></v-spacer>
    </v-footer>
    <v-dialog v-model="invalidUsernameDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Username is invalid</v-card-title>

        <v-card-text>The username you entered does not exist. Please check the username you entered and retry logging in.</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="invalidUsernameDialog = false">Got it</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="invalidPasswordDialog" max-width="290">
      <v-card>
        <v-card-title class="headline" color="red">Incorrect Password</v-card-title>

        <v-card-text>Please check your password you entered and retry logging in.</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="invalidPasswordDialog = false">Got it</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import imgDark from "../../../assets/full-logo-white.svg";
import imgLight from "../../../assets/full-logo.svg";
import gql from "graphql-tag";
export default {
  data() {
    return {
      username: null,
      password: null,
      isAdminLogin: false,
      imgDark,
      imgLight,
      invalidUsernameDialog: false,
      invalidPasswordDialog: false,
      isBtnLoading: false,
      usernameRule: [v => !!v || "Username is required"],
      passwordRule: [v => !!v || "Password is required"]
    };
  },
  name: "LoginPage",
  methods: {
    resetEverything() {
      this.$refs.form.reset();
      this.isBtnLoading = false;
    },
    toggleLogin() {
      this.isAdminLogin = !this.isAdminLogin;
      this.resetEverything();
    },
    getImage() {
      return this.isAdminLogin ? this.imgDark : this.imgLight;
    },
    handleLogin() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.isBtnLoading = true;
      if (this.isAdminLogin) {
        this.performAdminLogin();
      } else {
        this.performFacultyLogin();
      }
    },
    performAdminLogin() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation AdminLogin($username: String!, $password: String!) {
              adminLogin(username: $username, password: $password) {
                id
                errors {
                  message
                }
              }
            }
          `,
          variables: {
            username: this.username,
            password: this.password
          }
        })
        .then(response => {
          if (response.data.adminLogin.id) {
            this.$parent.updateLocalStorage({
              id: response.data.adminLogin.id,
              name: "ADMINISTRATOR",
              isAdmin: this.isAdminLogin
            });
            this.$parent.goToDashboard();
          }
          console.log(response);
          this.$refs.form.reset();
        })
        .catch(err => {
          this.isBtnLoading = false;
          console.log(err);
        });
    },
    performFacultyLogin() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation FacultyLogin($username: String!, $password: String!) {
              facultyLogin(username: $username, password: $password) {
                id
                name
                username
                errors {
                  message
                  errorCode
                }
              }
            }
          `,
          variables: {
            username: this.username,
            password: this.password
          }
        })
        .then(response => {
          if (response.data.facultyLogin.errors) {
            if (response.data.facultyLogin.errors[0].errorCode === "no_user") {
              this.invalidUsernameDialog = true;
              this.resetEverything();
            } else if (
              response.data.facultyLogin.errors[0].errorCode ===
              "password_invalid"
            ) {
              this.invalidPasswordDialog = true;
              this.resetEverything();
            }
          }
          if (response.data.facultyLogin.id) {
            this.$parent.updateLocalStorage({
              id: response.data.facultyLogin.id,
              name: response.data.facultyLogin.name,
              username: response.data.facultyLogin.username,
              isAdmin: this.isAdminLogin
            });
            this.$parent.goToDashboard();
          }
          console.log("LOGIN RESPONSE");
          console.log(response);
          this.$refs.form.reset();
        })
        .catch(err => {
          this.isBtnLoading = false;
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>

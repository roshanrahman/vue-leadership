<template>
  <v-app :dark="isAdminLogin">
    <v-layout align-center justify-space-around column>
      <v-flex xs2>
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
              <v-text-field v-model="username" box label="Username" type="text" required/>
              <v-text-field v-model="password" box label="Password" type="text" required/>
              <v-btn block color="primary" @click="handleLogin">LOG IN</v-btn>
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
      imgLight
    };
  },
  name: "LoginPage",
  methods: {
    toggleLogin() {
      this.isAdminLogin = !this.isAdminLogin;
    },
    getImage() {
      return this.isAdminLogin ? this.imgDark : this.imgLight;
    },
    handleLogin() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation Login($username: String!, $password: String!) {
              login(username: $username, password: $password) {
                id
                name
                username
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
          if (response.data.login.id) {
            this.$parent.updateLocalStorage({
              name: response.data.login.name,
              username: response.data.login.username,
              id: response.data.login.id
            });
            this.$parent.goToDashboard();
          }
          console.log(response);
          this.$refs.form.reset();
        })
        .catch(err => {
          alert(err);
        });
    }
  }
};
</script>

<style>
</style>

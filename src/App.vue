<template>
  <v-app :dark="dark">
    <v-toolbar app>
      <img :src="getImage()" style="max-height: 2.1em; padding-left:1em;">
      <v-toolbar-title class="headline text-uppercase"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat href="/graphql" target="_blank">
        <span class="mr-2">GraphQL Playground</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <HelloWorld/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import imgDark from "./assets/full-logo-white.svg";
import imgLight from "./assets/full-logo.svg";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data() {
    return {
      dark: true,
      imgLight,
      imgDark
    };
  },
  methods: {
    changeTheme() {
      this.dark = !this.dark;
    },
    getImage() {
      return this.dark ? this.imgDark : this.imgLight;
    }
  }
};
</script>

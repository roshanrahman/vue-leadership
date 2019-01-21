<template>
  <v-app :dark="dark">
    <v-toolbar app>
      <img :src="getImage()" style="max-height: 2.1em; padding-left:1em;">
      <v-toolbar-title class="headline text-uppercase"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat @click="changeTheme">
        <span class="mr-2">TOGGLE THEME</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <HelloWorld/>
    </v-content>
    <v-footer class="pa-3">
      <v-spacer></v-spacer>
      <div>&copy; Developed by the
        <b>CS Entry</b> team
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import imgDark from "./assets/full-logo-white.svg";
import imgLight from "./assets/full-logo.svg";
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: { HelloWorld },
  data() {
    return {
      dark: false,
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

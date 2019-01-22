<template>
  <v-app :dark="dark">
    <v-navigation-drawer stateless value="true" v-model="drawer" fixed app>
      <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>

        <v-list-group prepend-icon="star" value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title>Admin Actions</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('add-students')"
            :disabled="currentNavItem === 'add-students'"
          >
            <v-list-tile-action>
              <v-icon>people</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Add Students</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('add-courses')"
            :disabled="currentNavItem === 'add-courses'"
          >
            <v-list-tile-action>
              <v-icon>school</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Add Courses</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img :src="getImage()" style="max-height: 2.1em; padding-left:1em;">
      <v-toolbar-title class="headline text-uppercase"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat @click="changeTheme">
        <span class="mr-2">TOGGLE THEME</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <transition mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
    <v-footer class="pa-0">
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
import imgDark from "./assets/full-logo-white.svg";
import imgLight from "./assets/full-logo.svg";
import AddStudents from "./components/AddStudents";
import AddCourses from "./components/AddCourses";

export default {
  name: "App",
  components: { AddStudents, AddCourses },
  data() {
    return {
      drawer: null,
      dark: false,
      imgLight,
      imgDark,
      currentNavItem: null
    };
  },
  methods: {
    changeTheme() {
      this.dark = !this.dark;
    },
    getImage() {
      return this.dark ? this.imgDark : this.imgLight;
    },
    selectNavItem(navItemName) {
      switch (navItemName) {
        case "add-students": {
          this.$router.push("add-students");
          this.currentNavItem = "add-students";
          break;
        }
        case "add-courses": {
          this.$router.push("add-courses");
          this.currentNavItem = "add-courses";
          break;
        }
      }
    }
  }
};
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
</style>

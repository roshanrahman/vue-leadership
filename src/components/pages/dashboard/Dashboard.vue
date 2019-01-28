<template>
  <v-app :dark="dark">
    <v-navigation-drawer stateless value="true" v-model="drawer" app>
      <v-dialog v-model="dialog" width="500">
        <v-card color="red darken-4" dark>
          <v-card-title class="title">Connection to server lost
            <v-spacer></v-spacer>
            <v-progress-circular indeterminate></v-progress-circular>
          </v-card-title>
          <v-card-text>Some operations will not work unless the connection is restored. You can either wait, or continue working.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false; shown = true;" flat dark>Continue working</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-list>
        <v-card-title class="title" v-if="isMobile">Welcome, {{ this.session.name }}</v-card-title>
        <v-list-tile @click="selectNavItem('home')" :disabled="currentNavItem === 'home'">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>

        <v-list-group prepend-icon="star" value="true" v-if="!isAdmin()">
          <v-list-tile slot="activator">
            <v-list-tile-title>Leadership Board</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('add-mark-entry')"
            :disabled="currentNavItem === 'add-mark-entry'"
          >
            <v-list-tile-action>
              <v-icon>add_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Add Mark Entries</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('view-entries')"
            :disabled="currentNavItem === 'view-entries'"
          >
            <v-list-tile-action>
              <v-icon>visibility</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>View Entries</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
        <v-list-group prepend-icon="https" value="true" v-if="isAdmin()">
          <v-list-tile slot="activator">
            <v-list-tile-title>Admin Actions</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('view-all-entries')"
            :disabled="currentNavItem === 'view-all-entries'"
          >
            <v-list-tile-action>
              <v-icon>star</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>View Leadership Board Entries</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('view-students')"
            :disabled="currentNavItem === 'view-students'"
          >
            <v-list-tile-action>
              <v-icon>people</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>View Students</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('add-students')"
            :disabled="currentNavItem === 'add-students'"
          >
            <v-list-tile-action>
              <v-icon>add_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Add Students</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('view-courses')"
            :disabled="currentNavItem === 'view-courses'"
          >
            <v-list-tile-action>
              <v-icon>school</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>View Courses</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('add-courses')"
            :disabled="currentNavItem === 'add-courses'"
          >
            <v-list-tile-action>
              <v-icon>add_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Add Courses</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('view-faculty')"
            :disabled="currentNavItem === 'view-faculty'"
          >
            <v-list-tile-action>
              <v-icon>school</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>View Faculty</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click="selectNavItem('add-faculty')"
            :disabled="currentNavItem === 'add-faculty'"
          >
            <v-list-tile-action>
              <v-icon>add_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Add Faculty</v-list-tile-title>
          </v-list-tile>
        </v-list-group>

        <v-list-tile @click="logOut()" v-if="isMobile">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Log Out</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="changeTheme()" v-if="isMobile">
          <v-list-tile-action>
            <v-icon>brightness_2</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Toggle Dark Mode</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="selectNavItem('about')" :disabled="currentNavItem === 'about'">
          <v-list-tile-action>
            <v-icon>help_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>
            About
            CS Entry
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img :src="getImage()" style="max-height: 2.1em; padding-left:1em;">
      <v-toolbar-title class="headline text-uppercase"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-card-title class="body-2" v-if="!isMobile">Logged in as {{ this.session.name }}</v-card-title>
      <v-btn color="primary" flat @click="changeTheme">
        <span class="mr-2" v-if="!isMobile">TOGGLE THEME</span>
      </v-btn>
      <v-btn color="primary" @click="logOut" v-if="!isMobile">LOG OUT</v-btn>
    </v-toolbar>

    <v-content>
      <transition mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
    <!-- <v-footer class="pa-0">
      <v-spacer></v-spacer>
      <div @click="selectNavItem('about')" style="cursor: pointer; ">
        Developed by Team
        <b>404 FOUND</b>
      </div>
      <v-spacer></v-spacer>
    </v-footer>-->
  </v-app>
</template>

<script>
import imgDark from "../../../assets/full-logo-white.svg";
import imgLight from "../../../assets/full-logo.svg";
import ViewCourses from "../../pages/dashboard/view-courses/ViewCourses";
import gql from "graphql-tag";

export default {
  name: "Dashboard",
  mounted() {
    this.isMobile = this.$vuetify.breakpoint.smAndDown;
    if (localStorage.session) {
      this.session = JSON.parse(localStorage.session);
    }
    this.$nextTick(function() {
      window.setInterval(() => {
        if (this.test !== "testing") {
          if (!this.shown) {
            this.dialog = true;
          }
        } else {
          this.dialog = false;
          this.shown = false;
        }
        console.log(this.test);
      }, 3000);
    });
  },
  components: {
    ViewCourses
  },
  data() {
    return {
      isMobile: false,
      drawer: false,
      dark: false,
      imgLight,
      imgDark,
      test: "testing",
      dialog: false,
      shown: false,
      currentNavItem: null,
      session: null,
      connectionLostDialog: false
    };
  },
  apollo: {
    test: {
      query: gql`
        query Test {
          test
        }
      `,
      pollInterval: 5000
    }
  },
  methods: {
    logOut() {
      localStorage.session = null;
      this.$router.replace("/");
    },
    isAdmin() {
      return this.session.isAdmin;
    },
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
        case "add-mark-entry": {
          this.$router.push("add-mark-entry");
          this.currentNavItem = "add-mark-entry";
          break;
        }
        case "add-faculty": {
          this.$router.push("add-faculty");
          this.currentNavItem = "add-faculty";
          break;
        }
        case "view-students": {
          this.$router.push("view-students");
          this.currentNavItem = "view-students";
          break;
        }
        case "view-faculty": {
          this.$router.push("view-faculty");
          this.currentNavItem = "view-faculty";
          break;
        }
        case "view-courses": {
          this.$router.push("view-courses");
          this.currentNavItem = "view-courses";
          break;
        }
        case "view-entries": {
          this.$router.push("view-entries");
          this.currentNavItem = "view-entries";
          break;
        }
        case "view-all-entries": {
          this.$router.push("view-all-entries");
          this.currentNavItem = "view-all-entries";
          break;
        }
        case "about": {
          this.$router.push("about");
          this.currentNavItem = "about";
          break;
        }
        case "home": {
          this.$router.push({ name: "home" });
          this.currentNavItem = "home";
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

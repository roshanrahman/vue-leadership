<template>
  <router-view/>
</template>

<script>
import Dashboard from "./components/pages/dashboard/Dashboard";
import LoginPage from "./components/pages/login-page/LoginPage";

export default {
  name: "App",
  data() {
    return {
      sessionFromLS: null,
      session: {
        name: "",
        username: "",
        id: ""
      }
    };
  },
  mounted() {
    if (localStorage.session) {
      this.sessionFromLS = JSON.parse(localStorage.session);
      this.session = this.sessionFromLS;
      if (this.session.id) {
        this.goToDashboard();
      }
      console.log("LOCAL STORAGE");

      console.log(this.sessionFromLS);
    }
  },
  components: {
    Dashboard,
    LoginPage
  },
  methods: {
    goToDashboard() {
      this.$router.replace("dashboard");
    },
    updateLocalStorage(incomingSession) {
      localStorage.session = JSON.stringify(incomingSession);
    }
  }
};
</script>


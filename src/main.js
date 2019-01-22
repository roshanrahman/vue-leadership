import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import { createProvider } from "./vue-apollo";
import colors from "vuetify/es5/util/colors";
import Vuetify from "vuetify";

Vue.config.productionTip = false;
Vue.use(Vuetify, {
  theme: {
    primary: colors.teal,
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3
  }
});
new Vue({
  router,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");

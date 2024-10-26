import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";  // Import your router configuration


loadFonts();

createApp(App).use(vuetify).use(router).mount("#app");

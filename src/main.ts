import App from "./App.vue";
import "./style.css";
import "vue3-toastify/dist/index.css";
import { toastContainers } from "vue3-toastify";
import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";

library.add(farStar, fasStar);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("ToastContainer", toastContainers)
  .mount("#app");

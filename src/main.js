// import Vue from 'vue'
import App from "./App.vue";
import "./registerServiceWorker";
import "./style.css";

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

import { createApp } from "vue";

const app = createApp(App);
app.mount("#app");

import { createApp } from "vue";
import App from "./App.vue";
import router from "./config";
import store from "./store";
import { registerLayouts } from './layouts/register';
import "./style.css";

const app = createApp(App);

app.use(router);
app.use(store);
registerLayouts(app);
app.mount("#app");

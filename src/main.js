import "./style.css";
import App from "./App.vue";
import { createApp } from "vue";

import { registerLayouts } from './layouts/register';

import router from "./config";
import route from "./config";

import store from "./store";

import axiosApi from "./composables/axios-api";
import apiPath from "./composables/api-path";

import Loading from "./components/loading.vue";
import AddNewItem from "./components/addNewItem.vue";
import error from "../components/error.vue"
import modalComp from "./components/modalComp.vue";

import SearchIconSVG from "./assets/searchIcon.svg";
import ArrowIconSVG from "./assets/arrowLeftIcon.svg";
import CloseIconSVG from "./assets/removeIcon.svg";
import PlusIconSVG from "./assets/addIcon.svg";
import MinusIconSVG from "./assets/reduceIcon.svg";
import InfoIconSVG from "./assets/infoIcon.svg";

import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
dayjs.extend(jalaliday);

const app = createApp(App);

app.use(router);
app.use(store);
app.use(route);
app.use(apiPath);
app.component('Loading', Loading);
app.component('error', error);
app.component('modalComp', modalComp);
app.component('AddNewItem', AddNewItem);
app.component('SearchIconSVG', SearchIconSVG);
app.component('ArrowIconSVG', ArrowIconSVG);
app.component('CloseIconSVG', CloseIconSVG);
app.component('PlusIconSVG', PlusIconSVG);
app.component('MinusIconSVG', MinusIconSVG);
app.component('InfoIconSVG', InfoIconSVG);
app.config.globalProperties.$dayjs = dayjs;
app.config.globalProperties.$jalaliday = jalaliday;
app.config.globalProperties.$axiosApi = { ...axiosApi}

registerLayouts(app);
app.mount("#app");

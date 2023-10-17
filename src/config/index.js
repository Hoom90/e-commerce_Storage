import store from "../store";

import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import Warehouse from "../views/WarehouseView.vue";
import Cashier from "../views/CashierView.vue";
import Status from "../views/StatusView.vue";
import AddNewItem from "../views/AddNewItem.vue";
import AddNewListItem from "../views/AddNewListItem.vue";
import AddNewOrder from "../views/AddNewOrder.vue";
import EditItem from "../views/EditItem.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView,
    },
    {
      path: "/warehouse",
      children: [
        {
          path: "",
          component: Warehouse,
        },
        {
          path: ":id",
          component: EditItem,
        },
        {
          path: "newitem",
          component: AddNewItem,
        },
        {
          path: "newlist",
          component: AddNewListItem,
        },
        {
          path: "newOrder",
          component: AddNewOrder,
        },
      ],
    },
    {
      path: "/cashier",
      component: Cashier,
    },
    {
      path: "/status",
      component: Status,
    },
    {
      path: "/login",
      component: LoginView,
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = getWithExpiry("token");
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});
export default router;

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);

  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    store.dispatch("auth/logout");
    router.push("/login");
    return null;
  }
  return item.value;
}

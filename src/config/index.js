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
  const loggedIn = localStorage.getItem("token");
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});
export default router;

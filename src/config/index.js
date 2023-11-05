import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import Warehouse from "../views/WarehouseView.vue";
import Cashier from "../views/CashierView.vue";
import Status from "../views/StatusView.vue";
import StatusByWeek from "../views/StatusByWeekView.vue";
import StatusByMonth from "../views/StatusByMonthView.vue";
import StatusByYear from "../views/StatusByYearView.vue";
import AddNewItem from "../views/AddNewItem.vue";
import AddNewListItem from "../views/AddNewListItem.vue";
import AddNewOrder from "../views/AddNewOrder.vue";
import EditItem from "../views/EditItem.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Cashier,
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
      path: "/status",
      children: [
        {
          path: "",
          component: Status,
        },
        {
          path: "week",
          component: StatusByWeek,
        },
        {
          path: "month",
          component: StatusByMonth,
        },
        {
          path: "year",
          component: StatusByYear,
        },
      ],
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
  const loggedIn = sessionStorage.getItem("token");
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});
export default router;

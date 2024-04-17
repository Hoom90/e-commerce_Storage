import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import Warehouse from "../views/WarehouseView.vue";
import Cashier from "../views/CashierView.vue";
import Status from "../views/StatusView.vue";
import StatusByWeek from "../views/statusView/StatusByWeekView.vue";
import StatusByMonth from "../views/statusView/StatusByMonthView.vue";
import StatusByYear from "../views/statusView/StatusByYearView.vue";
import AddNewItem from "../views/warehouseView/AddNewItem.vue";
import AddNewListItem from "../views/warehouseView/AddNewListItem.vue";
import AddNewOrder from "../views/warehouseView/AddNewOrder.vue";
import EditItem from "../views/warehouseView/EditItem.vue";
import { reactive } from "vue";

const state = reactive({
  layout: "",
});
const screenWidth = window.innerWidth;
const isMobileLayout = screenWidth < 600;

if (isMobileLayout) {
  state.layout = "mobile";
} else {
  state.layout = "desktop";
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Cashier,
      meta: {
        layout: state.layout,
      },
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
      meta: {
        layout: state.layout,
      },
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
      meta: {
        layout: state.layout,
      },
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

// Add resize event listener to dynamically change layout based on screen size
// window.addEventListener("resize", () => {
//   const screenWidth = window.innerWidth;
//   const isMobileLayout = screenWidth < 600;

//   router.currentRoute.value.matched.forEach(routeRecord => {
//     if (routeRecord.meta.layout === 'desktop' && isMobileLayout) {
//       // routeRecord.instances.default.$options.layout = 'mobile';
//       routeRecord.meta.layout = 'mobile'
//     } else {
//       routeRecord.meta.layout = 'desktop'
//       // routeRecord.instances.default.$options.layout = 'desktop';
//     }
//   });
// });

export default router;

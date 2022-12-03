import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../pages/PageHome.vue";
// import PageCustomTable from "../pages/PageCustomTable.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    // {
    //   path: "/spreadsheet",
    //   name: "spreadsheet",
    //   component: () => import("../pages/PageTable.vue"),
    // },
    {
      path: "/table",
      name: "table",
      component: () => import("../pages/PageCustomTable.vue"),
    },
  ],
});

export default router;

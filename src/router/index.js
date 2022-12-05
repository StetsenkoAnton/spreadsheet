import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../pages/PageHome.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/table",
      name: "table",
      component: () => import("../pages/PageTable.vue"),
    },
  ],
});

export default router;

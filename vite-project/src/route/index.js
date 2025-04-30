import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Workspace",
    component: import("@/views/Workspace.vue"),
    children: [
      {
        path: "/Router",
        name: "Router",
        component: import("@/views/Router.vue"),
      },
      {
        path: "/Service",
        name: "Service",
        component: import("@/views/Service.vue"),
      },
      {
        path: "/Upstream",
        name: "Upstream",
        component: import("@/views/Upstream.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

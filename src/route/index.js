import { createRouter, createWebHashHistory } from "vue-router";
import WorkSpace from "@/views/WorkSpace.vue";
import Router from "@/views/Router.vue";
import Service from "@/views/Service.vue";
import Upstream from "@/views/Upstream.vue";
import SSL from "@/views/SSL.vue";
import GlobalRules from "@/views/global_rules.vue";

const routes = [
  {
    path: "/",
    redirect: "/Router",
    name: "Workspace",
    component: WorkSpace,
    children: [
      {
        path: "/Router",
        name: "Router",
        component: Router,
      },
      {
        path: "/Service",
        name: "Service",
        component: Service,
      },
      {
        path: "/Upstream",
        name: "Upstream",
        component: Upstream,
      },
      {
        path: "/SSL",
        name: "SSL",
        component: SSL,
      },
      {
        path: "/global_rules",
        name: "global_rules",
        component: GlobalRules,
      },
      // {
      //   path: "/ll",
      //   name: "a",
      //   component: import("@/views/Router.vue"),
      // },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

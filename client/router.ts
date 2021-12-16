import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".container"));

router.setRoutes([
  { path: "/", component: "welcome-page" },
]);

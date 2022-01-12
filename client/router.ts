import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".container"));

router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/home", component: "home-dos-page" },
  { path: "/access-room", component: "access-room-page" },
  { path: "/register", component: "register-page" },
  { path: "/share-code", component: "share-code" },
  { path: "/waiting-opp", component: "waiting-comp" },
  { path: "/play", component: "play-page" },
  { path: "/results", component: "results-page" },
  { path: "/full-room", component: "full-room-page" },
]);

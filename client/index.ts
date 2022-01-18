import { state } from "./state";
import "./router";

import "./components/text";
import "./components/button";
import "./components/stars";
import "./components/countdown";
//hands
import "./components/hands";
import "./components/hands/user-hands";
import "./components/hands/computer-hands";
import "./components/hands/play2-hands-users";
//pages
import "./pages/home";
import "./pages/home-dos";
import "./pages/register";
import "./pages/access-room"
import "./pages/share-code";
import "./pages/waiting-opp";
import "./pages/play";
import "./pages/play-hands";
import "./pages/results";
import "./pages/full-room";

(function () {
  state.init()
})();

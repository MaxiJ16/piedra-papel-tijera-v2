const API_BASE_URL = "https://heroku-mod6-chat.herokuapp.com";
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
//pages
import "./pages/home";

(function () {
  fetch("https://piedra-papel-tijera-mod6.herokuapp.com/" + "/rtdb")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
    });
  state.init();
})();

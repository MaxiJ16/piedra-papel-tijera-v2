
import { state } from "./state";
import { rtdb } from "./rtdb";

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
import "./pages/play-dos";
import "./pages/results";
import "./pages/full-room";

(function () {
  state.init()
  
})();
// const chatroomsRef = rtdb.ref("/rooms/m69D9nOQmh_gLITXJUaXC")
//   chatroomsRef.on("value", (snapshot) => {
//     // cada vez que cambia obtenemos la última versión del estado
//     // const currentState = this.getState();
//     // cuando message recibe un nuevo valor recibimos el snapshot y lo guardamos en messagesFromServer
//     const currentGameFromServer = snapshot.val();
//     // cada vez que haya un cambio vamos a traernos del server solo la parte de messages y la vamos a guardar en el state
//     // primero lo tenemos que mapear
//     const currentsList = map(currentGameFromServer.currentGame);
//     console.log(currentGameFromServer);
//     console.log(currentsList);
    
//     // this.setState(currentState);
//   });

// fetch("https://piedra-papel-tijera-mod6.herokuapp.com" + "/rtdb")
//   .then((res) => {
//     return res.json();
//   })
//   .then((data) => {
//     console.log(data);
//   });
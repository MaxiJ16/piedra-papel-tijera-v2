// const cs = state.getState();
// this.rtdb = cs.dataRtdb;

// if (cs.user1Name == "") {
//   if (
//     location.pathname == "/waiting-opp" &&
//     this.rtdb[0].start == true &&
//     this.rtdb[1].start == true
//   ) {
//     console.log("jugador 2 = conectedcallback = true");
//     console.log(location.pathname, "location");

//     Router.go("/play");
//   }
// } else if (cs.user2Name == "") {
//   if (
//     location.pathname == "/waiting-opp" &&
//     this.rtdb[0].start == true &&
//     this.rtdb[1].start == true
//   ) {
//     console.log("conectedcallback = true");
//     console.log(location.pathname, "location");

//     Router.go("/play");
//   }
// }
// state.subscribe(() => {
//   const cs = state.getState();
//   this.rtdb = cs.dataRtdb;
//   console.log("subscribe");
//   console.log("addlistener", this.rtdb);
//   console.log(location.pathname, "location");
//   console.log(this.rtdb[0].start, "jugador 1 start");
//   console.log(this.rtdb[1].start, "jugador 2 start");

//   if (!cs.dataRtdb[0].start || !cs.dataRtdb[1].start) {
//     console.error("waiting one player");
//   }
//   if (
//     location.pathname == "/waiting-opp" &&
//     cs.dataRtdb[0].start == true &&
//     cs.dataRtdb[1].start == true
//   ) {
//     Router.go("/play");
//   }
//   if(location.pathname == "/play") {
//     Router.go("/play")
//   }
// });
import { Router } from "@vaadin/router";
import { state } from "../../state";

class WaitingOpp extends HTMLElement {
  connectedCallback() {
    state.subscribe(() => {
      const cs = state.getState();
      if (
        (location.pathname == "/waiting-opp" && !cs.dataRtdb[0].start) ||
        !cs.dataRtdb[1].start
      ) {
        console.error("waiting player");
      }
      if (
        location.pathname == "/waiting-opp" &&
        cs.dataRtdb[0].start == true &&
        cs.dataRtdb[1].start == true
      ) {
        Router.go("/play");
      }
      this.render();
    });

    this.render();
    // if(location.pathname == "/waiting-opp"){
    //   Router.go("/play")
    // }
  }
  rtdb: {};
  render() {
    this.innerHTML = `
    <header class="waitingOpp-header">
      <div class="header-names">
        <my-text tag="h5">${state.data.dataRtdb[0].name}</my-text>
        <my-text class="opponent-name" tag="h5">${state.data.dataRtdb[1].name}</my-text>
      </div>
      <div class="waitingOpp-rooms">
        <my-text tag="h5">Sala</my-text>
        <my-text tag="h5">${state.data.roomId}</my-text>
      </div>
    </header>

    <section class="waitingOpp">
      <div class="waitingOpp__text">
        <my-text tag="p">Esperando a que el oponente presione ¡Jugar!...</my-text>
      </div> 
    
      <div class="waitingOpp__hands">
        <my-hands></my-hands>
      </div>
    </section>
    
  `;
  }
}
customElements.define("waiting-comp", WaitingOpp);

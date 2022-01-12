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
    // state.subscribe(() => {
    //   const cs = state.getState();
    //   console.log("soy el subscribe");

    //   if (
    //     (location.pathname == "/waiting-opp" && !cs.dataRtdb[0].start) ||
    //     !cs.dataRtdb[1].start
    //   ) {
    //     console.error("waiting player");
    //   }
    //   if (
    //     location.pathname == "/waiting-opp" &&
    //     cs.dataRtdb[0].start == true &&
    //     cs.dataRtdb[1].start == true
    //   ) {
    //     Router.go("/play");
    //   }
    //   this.render();
    // });

    this.render();
    let player1Start: boolean;
    let player2Start: boolean;
    const text = document.querySelector(".text") as any;
    const text2 = document.querySelector(".text2") as any;
    const buttonEl = document.querySelector(".instructions__btn") as any;
    const cs = state.getState();

    buttonEl.addEventListener("click", () => {
      console.log("click");

      if (cs.user2Name == "") {
        state.startUser1();
        player1Start = true;
        if (player1Start == true && player2Start !== true) {
          text.style.display = "none";
          text2.style.display = "initial";
          buttonEl.style.display = "none";
        }
      }
      if (cs.user1Name == "") {
        state.startUser2();
        player2Start = true;
        if (player1Start !== true && player2Start == true) {
          text.style.display = "none";
          text2.style.display = "initial";
          buttonEl.style.display = "none";
        }
        text.style.display = "none";
        text2.style.display = "initial";
        buttonEl.style.display = "none";
      }
    });

    state.subscribe(() => {
      console.log(" soy el subscribe");
      const cs = state.getState();
      // if ((pageWaiting && !cs.dataRtdb[0].start) || !cs.dataRtdb[1].start) {
      //   console.error("waiting player");
      // }
      this.rtdb = cs.dataRtdb;
      console.log(this.rtdb, "rtdb");

      if (
        location.pathname == "/waiting-opp" &&
        this.rtdb[0].start == true &&
        this.rtdb[1].start == true
      ) {
        Router.go("/play");
      }
    });
  }
  rtdb: {};

  render() {
    this.innerHTML = `
    <header class="waitingOpp-header">
      <div class="header-names">
        <my-text tag="h5">${state.data.dataRtdb[0].name} </my-text>
        <my-text class="opponent-name" tag="h5">${state.data.dataRtdb[1].name}</my-text>
      </div>
      <div class="waitingOpp-rooms">
        <my-text tag="h5">Sala</my-text>
        <my-text tag="h5">${state.data.roomId}</my-text>
      </div>
    </header>
      
    <section class="waitingOpp">
      <div class="waitingOpp__text">
        <my-text class="text" tag="p">Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</my-text>
        <my-text class="text2" tag="p">Esperando a que el oponente presione ¡Jugar!...</my-text>
        <button class="instructions__btn button">¡Jugar!</button>
      </div> 
    
      <div class="waitingOpp__hands">
        <my-hands></my-hands>
      </div>

    </section>
    
  `;
  }
}
customElements.define("waiting-comp", WaitingOpp);

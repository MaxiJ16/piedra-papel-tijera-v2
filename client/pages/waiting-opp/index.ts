import { Router } from "@vaadin/router";
import { state } from "../../state";

class WaitingOpp extends HTMLElement {
  connectedCallback() {
    this.render();
    const cs = state.getState();

    const text = document.querySelector(".text") as any;
    const text2 = document.querySelector(".text2") as any;
    const buttonEl = document.querySelector(".instructions__btn") as any;

    // Botón de start
    buttonEl.addEventListener("click", () => {
      if (cs.user2Name == "") {
        state.startUser1();
      }
      if (cs.user1Name == "") {
        state.startUser2();
      }

      text.style.display = "none";
      text2.style.display = "initial";
      buttonEl.style.display = "none";
    });

    state.subscribe(() => {
      const cs = state.getState();

      if (location.pathname == "/waiting-opp" && cs.dataRtdb[0].start == false || cs.dataRtdb[1].start == false) {
        console.error("Falta que el otro jugador presione start");
      }
      if (cs.dataRtdb[0].start == true && cs.dataRtdb[1].start == true && location.pathname == "/waiting-opp") {
        Router.go("/play");
      }
    });
  }

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

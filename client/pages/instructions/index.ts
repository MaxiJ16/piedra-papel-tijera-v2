import { Router } from "@vaadin/router";
import { state } from "../../state";

class Instructions extends HTMLElement {
  connectedCallback() {
    this.render();

    const cs = state.getState();

    const buttonEl = document.querySelector(".instructions__btn");

    buttonEl.addEventListener("click", (e) => {
      e.preventDefault();

      if (cs.user2Name == "") {
        state.startUser1();
      } else if (cs.user1Name == "") {
        state.startUser2();
      }
      Router.go("/waiting-opp");
    });
  }
  render() {
    this.innerHTML = `
    <header class="instructions-header">
      <div class="header-names">
        <my-text tag="h5">${state.data.dataRtdb[0].name}</my-text>
        <my-text class="opponent-name" tag="h5">${state.data.dataRtdb[1].name}</my-text>
      </div>
      <div class="header-rooms">
        <my-text tag="h5">Sala</my-text>
        <my-text tag="h5">${state.data.roomId}</my-text>
      </div>
    </header>

    <section class="instructions">
      <div class="instructions__text">
        <my-text tag="p">Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</my-text>
      </div> 

      <form class="form">
        <button class="instructions__btn button">¡Jugar!</button>
      </form>
    
      <div class="instructions__hands">
        <my-hands></my-hands>
      </div>
    </section>
    
  `;
  }
}
customElements.define("instructions-page", Instructions);

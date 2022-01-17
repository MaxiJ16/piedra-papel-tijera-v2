import { state } from "../../state";
import { Router } from "@vaadin/router";
// state.subscribe(() => {
//   const cs = state.getState();
//   if (cs.dataRtdb[0].start == false && cs.dataRtdb[1].start == false) {
//
//   }
// })

class Results extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  listeners() {
    const cs = state.getState();
    const buttonEl = document.querySelector(".return");

    buttonEl.addEventListener("click", () => {
      if (cs.user2Name == "") {
        state.restart();

        console.log("Jugador 1 presiono");
      }

      if (cs.user1Name == "") {
        state.restart();

        console.log("Jugador 2 presiono");
      }
    });
  }
  render() {
    const cs = state.getState();
    const moveUser1 = cs.dataRtdb[0].move;
    const moveUser2 = cs.dataRtdb[1].move;

    let result: string = state.whoWins(moveUser1, moveUser2);

    if (cs.user2Name && result == "Ganaste") {
      result = "Perdiste";
    } else if (cs.user2Name && result == "Perdiste") {
      result = "Ganaste";
    }

    this.innerHTML = `
      <div class="results result">
      <my-stars tag="${result}" class="star"></my-stars>

      <div class="score">
        <my-text tag="h3" class="score-title">Score</my-text>
        <div class="score-contain">
          <my-text tag="h4">${cs.dataRtdb[0].name}: ${cs.history.user1}</my-text>
          <my-text tag="h4">${cs.dataRtdb[1].name}: ${cs.history.user2}</my-text>
        </div>
      </div>
  
      <my-button class="return">Volver a Jugar</my-button>
      </div>
    `;
    this.listeners();
  }
}

customElements.define("results-page", Results);

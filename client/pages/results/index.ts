import { state } from "../../state";
import { Router } from "@vaadin/router";

class Results extends HTMLElement {
  connectedCallback() {
    this.render();
    const cs = state.getState();
  }
  addListener() {
    const buttonEl = document.querySelector(".return");

    buttonEl.addEventListener("click", () => {
      state.restart();
      Router.go("/waiting-opp");
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
    this.addListener();
  }
}

customElements.define("results-page", Results);

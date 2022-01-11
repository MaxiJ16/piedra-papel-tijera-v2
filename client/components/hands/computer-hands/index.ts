import { state } from "../../../state";

const piedraImg = require("url:../../../../client/assets/piedra.png");
const papelImg = require("url:../../../../client/assets/papel.png");
const tijeraImg = require("url:../../../../client/assets/tijera.png");

export class ComputerHands extends HTMLElement {
  shadow: ShadowRoot;
  type: string;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.type = this.getAttribute("type");
  }
  connectedCallback() {
    this.render();
  }

  render() {
    const cs = state.getState();
    const container = document.createElement("div");
    container.className = "container";

    let computerChoice = "";

    // si el jugador 1 no me aparece el nombre quiere decir que soy el jugador 2
    // la jugada del jugador 1 contaría como la de la pc
    if (cs.user1Name == "") {
      computerChoice = cs.dataRtdb[0].move;
    } else if (cs.user2Name == "") {
      computerChoice = cs.dataRtdb[1].move;
    }

    state.listenRoom();
    // const computerChoice = Math.floor(Math.random() * (4 - 1) + 1);
    

    if (computerChoice == "piedra") {
      container.innerHTML = `
      <img class="piedra" src=${piedraImg}>
      `;
      // state.setComputerMove("piedra");
    } else if (computerChoice == "papel") {
      container.innerHTML = `
      <img class="papel" src=${papelImg}>
      `;
      // state.setComputerMove("papel");
    } else if (computerChoice == "tijera") {
      container.innerHTML = `
      <img class="tijera" src=${tijeraImg}>
      `;
      // state.setComputerMove("tijera");
    }

    const style = document.createElement("style");
    style.innerHTML = `
      .piedra, .papel, .tijera {
        transform:rotate(180deg);
        height: 300px;
      }
      @media(min-width: 1200px){
        .piedra, .papel, .tijera {
          height: 400px;
        }
      }
    `;

    this.shadow.appendChild(style);
    this.shadow.appendChild(container);
  }
}
customElements.define("computer-hands", ComputerHands);

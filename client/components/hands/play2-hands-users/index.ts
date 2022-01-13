import { state } from "../../../state";

const piedraImg = require("url:../../../../client/assets/piedra.png");
const papelImg = require("url:../../../../client/assets/papel.png");
const tijeraImg = require("url:../../../../client/assets/tijera.png");

export class Play2Hands extends HTMLElement {
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

    let userChoice = "";

    
      if (cs.user1Name == "") {
        userChoice = cs.dataRtdb[1].move;
      } else if (cs.user2Name == "") {
        userChoice = cs.dataRtdb[0].move;
      }
    
    

    // const computerChoice = Math.floor(Math.random() * (4 - 1) + 1);

    if (userChoice == "piedra") {
      container.innerHTML = `
        <img class="piedra" src=${piedraImg}>
        `;
      // state.setComputerMove("piedra");
    } else if (userChoice == "papel") {
      container.innerHTML = `
        <img class="papel" src=${papelImg}>
        `;
      // state.setComputerMove("papel");
    } else if (userChoice == "tijera") {
      container.innerHTML = `
        <img class="tijera" src=${tijeraImg}>
        `;
      // state.setComputerMove("tijera");
    }

    const style = document.createElement("style");
    style.innerHTML = `
      .piedra, .papel, .tijera {
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
customElements.define("play2-hands", Play2Hands);

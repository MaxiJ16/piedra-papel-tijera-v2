import { state } from "../../../state";

const piedraImg = require("url:../../../../client/assets/piedra.png");
const papelImg = require("url:../../../../client/assets/papel.png");
const tijeraImg = require("url:../../../../client/assets/tijera.png");

export class UserHands extends HTMLElement {
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
    const div = document.createElement("div");
    div.className = "container";
    div.innerHTML = `
    <img class="piedra" src=${piedraImg}>
    <img class="papel" src=${papelImg}>
    <img class="tijera" src=${tijeraImg}>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .container {
        display: flex;
        justify-content: space-between;
        width: 300px;
        align-items: flex-end;
        overflow: hidden;
      }

      @media(min-width: 769px){
        .container {
          width: 400px;
        }
      }

      .piedra, .papel, .tijera {
        height: 180px;
        position: relative;
        top: 2px;
      }

      @media(min-width: 769px){
        .piedra, .papel, .tijera {
          height: 200px;
        }
      }
    `;

    this.shadow.appendChild(style);
    this.shadow.appendChild(div);

    const piedra = div.querySelector(".piedra");
    piedra.addEventListener("click", () => {
      style.innerHTML = `
        .piedra {
          height: 300px;
        }
        
        @media(min-width: 1200px){
          .piedra {
            height: 400px;
          }
        }
        .tijera, .papel {
          display: none;
        }
      `;
      state.setMove("piedra");
    });

    const papel = div.querySelector(".papel");
    papel.addEventListener("click", () => {
      style.innerHTML = `
        .papel {
          height: 300px;
        }
        @media(min-width: 1200px){
          .papel {
            height: 400px;
          }
        }
        .tijera, .piedra {
          display: none;
        }
      `;
      state.setMove("papel");
    });

    const tijera = div.querySelector(".tijera");
    tijera.addEventListener("click", () => {
      style.innerHTML = `
        .tijera {
          height: 300px;
        }
        @media(min-width: 1200px){
          .tijera {
            height: 400px;
          }
        }
        .piedra, .papel {
          display: none;
        }
      `;
      state.setMove("tijera");
    });
  }
}
customElements.define("user-hands", UserHands);

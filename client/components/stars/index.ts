const winnerStart = require("url:../../../client/assets/ganaste.png");
const loserStart = require("url:../../../client/assets/perdiste.png");
const empateStart = require("url:../../../client/assets/empate.svg");

export class Star extends HTMLElement {
  shadow: ShadowRoot;
  tag: string;
  img: string;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.tag = this.getAttribute("tag");
  }
  connectedCallback() {
    this.starChoice();
    this.render();
  }
  starChoice() {
    if (this.tag == "Ganaste") {
      this.img = winnerStart;
    } else if (this.tag == "Perdiste") {
      this.img = loserStart;
    } else {
      this.img = empateStart;
    }
  }
  render() {
    const div = document.createElement("div");
    div.className = "container";

    div.innerHTML = `
    <img class="star" src=${this.img} alt="star">
    <my-text tag="h4" class="text">${this.tag}</span>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
    * {
      box-sizing: border-box;
    }
    
    .container {
      width: 300px;
      height: 300px;
      position: relative;
    }
    
    .star {
      height: 300px;
    }

    .text {
      position: absolute;
      top: 90px;
      left: 70px;
      transform: rotate(-30deg)
    }
    `;

    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
  }
}
customElements.define("my-stars", Star);

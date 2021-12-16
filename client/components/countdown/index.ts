export class CountDown extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const div = document.createElement("div");
    div.className = "container";
    div.innerHTML = `
    <div class="container__countdown"></div>
    `;
    const container = div.querySelector(".container__countdown");

    let counter = 4;

    const intervalId = setInterval(() => {
      counter--;
      container.innerHTML = `
        <h1 class="count">${counter.toString()}</h1>
      `;
      if (counter <= 0) {
        clearInterval(intervalId);
        this.shadow.removeChild(div);
      }
    }, 1000);

    const style = document.createElement("style");
    style.innerHTML = `
    .container {
      width: 100%;

    }

    .container__countdown {
      width: 243px;
      margin: 0 auto;
      height: 243px;
      position: relative;
      border: 23px solid #000000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      animation: loading 4s linear;
    }

    @keyframes loading {
      0% {
        border-top: 24px solid grey;
        border-right: 24px solid black;
        border-bottom: 24px solid black;
        border-left: 24px solid black;
      }

      25% {
        border-top: 24px solid white;
        border-right: 24px solid grey;
        border-bottom: 24px solid black;
        border-left: 24px solid black;
      }

      50% {
        border-right: 24px solid white;
        border-bottom: 24px solid grey;
        border-left: 24px solid black;
      }

      75% {
        border-bottom: 24px solid white;
        border-left: 24px solid grey;
      }
      
      100% {
        border-top: 24px solid white;
        border-right: 24px solid white;
        border-bottom: 24px solid white;
        border-left: 24px solid white;
      }
    }
    .count {
      font-size: 100px;
      margin: auto;
    }
  
    `;
    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
  }
}
customElements.define("my-countdown", CountDown);

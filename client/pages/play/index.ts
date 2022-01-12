import { Router } from "@vaadin/router";

class Play extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  //<my-countdown></my-countdown>
  render() {
    this.innerHTML = `
    <section class="play">
      <div class="play__computer">
        <computer-hands class="computer-choices"></computer-hands>
      </div>


      <div class="play__hands">
        <user-hands></user-hands>
      </div>
    </section>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .computer-choices {
        display: none;
      }
    `;

    setInterval(() => {
      style.innerHTML = `
        .computer-choices {
          display: "initial";
        }
      `;
    }, 4000);

    // setTimeout(() => {
    //   Router.go("/results");
    // }, 6000);

    this.appendChild(style);
  }
}

customElements.define("play-page", Play);

import { Router } from "@vaadin/router";

class Play extends HTMLElement {
  connectedCallback() {
    this.render();

    setTimeout(() => {
      Router.go("/play-hands");
    }, 4200);
  }

  render() {
    this.innerHTML = `
    <section class="play">
    <div class="play__computer">
    
    </div>
    
    <my-countdown class="countdown"></my-countdown>

    <div class="play__hands">
    <user-hands></user-hands>
    </div>
    </section>
    `;
  }
}

customElements.define("play-page", Play);

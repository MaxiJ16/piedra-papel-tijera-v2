import { Router } from "@vaadin/router";
import { state } from "../../state";

class Play extends HTMLElement {
  connectedCallback() {
    const cs = state.getState();

    this.render();

    setTimeout(() => {
      Router.go("/play-dos");
    }, 5000);
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

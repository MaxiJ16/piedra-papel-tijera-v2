import { Router } from "@vaadin/router";
import { state } from "../../state";

class PlayDos extends HTMLElement {
  connectedCallback() {
    const cs = state.getState();

    this.render();
  }
  render() {
    this.innerHTML = `
    <section class="playDos">

      <div class="play__computer">
        <computer-hands></computer-hands>
      </div>
      
      <div class="play__hands">
        <play2-hands></play2-hands>
      </div>

    </section>
    `;
  }
}

customElements.define("play-pagedos", PlayDos);

import { Router } from "@vaadin/router";

class FullRoom extends HTMLElement {
  // connectedCallback es el cb q tenemos que usar en los custom-elements para escribir de forma segura
  connectedCallback() {
    //aca seteamos al html
    this.render();
  }
  render() {
    this.innerHTML = `
      <section class="full-room">
        <div class="full-room-title">
          <my-text tag="h1">Piedra Papel ó Tijera</my-text>
        </div> 

        <div class="full-room__container"> 
          <my-text>Ups, esta sala está completa y tu nombre no coincide con nadie en la sala.</my-text>
        </div>

        <div class="welcome__hands">
          <my-hands></my-hands> 
        </div>
      </section>
    `;
  }
}

customElements.define("full-room-page", FullRoom);

import { Router } from "@vaadin/router";

class Welcome extends HTMLElement {
  // connectedCallback es el cb q tenemos que usar en los custom-elements para escribir de forma segura
  connectedCallback() {
    //aca seteamos al html
    this.render();
  }
  render() {
    this.innerHTML = `
      <section class="welcome">
        <div class="welcome__title">
          <my-text tag="h1">Piedra Papel ó Tijera</my-text>
        </div> 

        <div class="welcome__container-buttons"> 
          <my-button class="welcome__button">Nuevo Juego</my-button>
          <my-button class="welcome__button">Ingresar a una sala</my-button>
        </div>

        <div class="welcome__hands">
          <my-hands></my-hands> 
        </div>
      </section>
    `;
  }
}

customElements.define("welcome-page", Welcome);
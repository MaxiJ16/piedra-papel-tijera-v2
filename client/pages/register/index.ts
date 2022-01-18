// importo el Router
import { Router } from "@vaadin/router";
import { state } from "../../state";

class RegisterPage extends HTMLElement {
  connectedCallback() {
    this.render();
    const messageFromRegister = document.querySelector(
      ".messageFromRegister"
    ) as any;

    state.subscribe(() => {
      const cs = state.getState();
      messageFromRegister.textContent = cs.registerMessage;
      messageFromRegister.style.display = "initial";

      if (messageFromRegister.textContent == "Usuario registrado con éxito") {
        setTimeout(() => {
          if(location.pathname == "/register"){
            Router.go("/home");
          }
        }, 2000);
      }
    });
  }
  listeners() {
    const form = this.querySelector(".form");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const name = target.nombre.value;
      state.register(name);
    });
  }
  render() {
    this.innerHTML = `
      <section class="section">
        <my-text tag="h2">Register</my-text>
        <form class="form">
          <div>
            <my-text variant="subtitle">Nombre</my-text>
            <input class="input" type="text" name="nombre" required/>
          </div>
          <button class="button"><my-text variant="subtitle">Comenzar</my-text></button>
        </form>
        <span class="messageFromRegister"></span>
      </section>
    `;
    this.listeners();
  }
}

customElements.define("register-page", RegisterPage);

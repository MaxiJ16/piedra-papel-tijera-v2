// importo el Router
import { Router } from "@vaadin/router";
import { state } from "../../state";

class RegisterPage extends HTMLElement {
  // connectedCallback es el cb q tenemos que usar en los custom-elements para escribir de forma segura
  connectedCallback() {
    //aca seteamos al html
    this.render();

    //como ya ejecutamos el render ya tengo todo montado por eso
    //buscamos el formulario del render
    const form = this.querySelector(".form");
    const msg = this.querySelector(".messageFromRegister") as any;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const name = target.nombre.value;

      state.setUser1Name(name);
      state.register();
      msg.style.display = "initial";
      setTimeout(() => {
        Router.go("/home");
      }, 3000);
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
        <span class="messageFromRegister">Registrado con éxito! Redirigiendo..</span>
      </section>
    `;
  }
}

customElements.define("register-page", RegisterPage);

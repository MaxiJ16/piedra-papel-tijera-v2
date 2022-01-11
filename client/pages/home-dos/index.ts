import { Router } from "@vaadin/router";
import { state } from "../../state";

class HomeDos extends HTMLElement {
  // connectedCallback es el cb q tenemos que usar en los custom-elements para escribir de forma segura
  connectedCallback() {
    //aca seteamos al html
    this.render();
    const cs = state.getState();
    const newGameButtonEl = document.querySelector(".welcome__button-newGame");
    const enterRoomButtonEl = document.querySelector(
      ".welcome__button-enterRoom"
    );
    const containerButtons: any = document.querySelector(
      ".welcome__container-buttons"
    );
    const containerNewGame: any = document.querySelector(
      ".welcome__container-newGame"
    );

    // botón de nuevo juego

    newGameButtonEl.addEventListener("click", () => {
      containerButtons.style.display = "none";
      containerNewGame.style.display = "initial";
    });

    // formulario de nuevo juego (user 1)

    const formNewGame = document.querySelector(".newGame__form");

    formNewGame.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const name = target.nombre.value;

      state.setUser1Name(name);
      state.signIn((err) => {
        if (err) console.error("hubo un error en el signIn");
        state.askNewRoom(() => {
          state.accessToRoom(() => {
            Router.go("/share-code");
          });
        });
      });
    });

    // botón de ingresar a una sala

    enterRoomButtonEl.addEventListener("click", () => {
      Router.go("/access-room");
    });
  }
  render() {
    this.innerHTML = `
      <section class="welcome">
        <div class="welcome__title">
          <my-text tag="h1">Piedra Papel ó Tijera</my-text>
        </div> 

        <div class="welcome__container-buttons"> 
          <my-button class="welcome__button-newGame">Nuevo Juego</my-button>
          <my-button class="welcome__button-enterRoom">Ingresar a una sala</my-button>
        </div>

        <div class="welcome__container-newGame"> 
          <form class="newGame__form">
            <label class="newGame__form-label"><my-text tag="h4">Tu Nombre</my-text></label>
            <input class="input newGame__form-input" required name="nombre"/>
            <button class="newGame__form-button">Empezar</button>
          </form>
        </div>

        <div class="welcome__hands">
          <my-hands></my-hands> 
        </div>
      </section>
    `;
  }
}

customElements.define("home-dos-page", HomeDos);

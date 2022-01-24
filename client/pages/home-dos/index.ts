import { Router } from "@vaadin/router";
import { state } from "../../state";

class HomeDos extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  listener() {
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

    const formNewGame = document.querySelector(".newGame__form") as any;
    const errorEl = document.querySelector(".error") as any;
    const errorbtn = document.querySelector(".error-btn") as any;

    errorEl.style.display = "none";
    errorbtn.style.display = "none";

    formNewGame.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const name = target.nombre.value;

      state.setUser1Name(name);

      state.signIn((err) => {
        if (err) {
          console.error("hubo un error en el signIn");
        }
        if (
          cs.registerMessage == "user not found" &&
          !cs.user1Id &&
          location.pathname == "/home"
        ) {
          alert(
            "No hay un usuario registrado con ese nombre, prueba otro o ingresa al registro"
          );
        }

        state.askNewRoom(() => {
          state.accessToRoom(() => {
            if (window.location.pathname == "/home" && cs.user1Id) {
              Router.go("/share-code");
            }
          });
        });
      });
    });

    enterRoomButtonEl.addEventListener("click", () => {
      if (location.pathname == "/home") {
        Router.go("/access-room");
      }
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

        <my-text class="error">No hay un usuario registrado con ese nombre</my-text>
        <my-button class="error-btn">Ir al registro</my-button>

        <div class="welcome__hands">
          <my-hands></my-hands> 
        </div>
      </section>
    `;
    this.listener();
  }
}

customElements.define("home-dos-page", HomeDos);

import { Router } from "@vaadin/router";
import { state } from "../../state";

class AccesRoom extends HTMLElement {
  connectedCallback() {
    this.render();
    const cs = state.getState();

    const enterRoomForm = document.querySelector(".enterRoom__form") as any;
    const enterSecondPlayerForm = document.querySelector(
      ".enterSecondPlayer__form"
    ) as any;

    const errorEl = document.querySelector(".error") as any;
    const errorbtn = document.querySelector(".error-btn") as any;
    // formulario de segundo jugador

    enterSecondPlayerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const nameUser2 = target.nombre.value;

      state.setUser2Name(nameUser2);

      state.signInUser2((err) => {
        if (err) console.error("hubo un error en el signIn");
        const cs = state.getState();
        if (
          !cs.user2Id ||
          (cs.user2Id == undefined &&
            location.pathname == "/access-room" &&
            cs.registerMessage == "user not found")
        ) {
          alert(
            "No hay un usuario registrado con ese nombre, prueba otro o ingresa al registro"
          );
        }

        if (cs.user2Id && location.pathname == "/access-room") {
          enterSecondPlayerForm.style.display = "none";
          enterRoomForm.style.display = "initial";
        }
      });
    });

    // formulario de ingresar a una sala

    enterRoomForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const roomIdEl = target.roomId.value;
      cs.roomId = roomIdEl;

      state.accessToRoom(() => {
        state.subscribe(() => {
          if (cs.dataRtdb[1].userId && location.pathname == "/access-room") {
            Router.go("/full-room");
          } else if (
            !cs.dataRtdb[1].userId &&
            location.pathname == "/access-room"
          ) {
            state.setPlayer2ValuesRtdb();
            state.listenRoom();

            state.subscribe(() => {
              if (
                cs.dataRtdb[0].online == false ||
                cs.dataRtdb[1].online == false
              ) {
                console.error("Some player is not connected");
              }
              if (
                cs.dataRtdb[0].online == true &&
                cs.dataRtdb[1].online == true &&
                window.location.pathname == "/access-room"
              ) {
                Router.go("/waiting-opp");
              }
            });
          }
        });
      });
    });
  }
  render() {
    this.innerHTML = `
      <section class="welcome">
        <div class="welcome__title">
          <my-text tag="h1">Piedra Papel ó Tijera</my-text>
        </div> 

        <div class="welcome__container-enterRoom"> 

          <form class="enterSecondPlayer__form">
            <label class="enterSecondPlayer__form-label"><my-text tag="h4">Tu Nombre</my-text></label>
            <input class="input enterSecondPlayer-input" required name="nombre"/>
            <button class="enterSecondPlayer-button button">Empezar</button>
          </form>

          <form class="enterRoom__form">
            <input class="input enterRoom__form-input" placeholder="código" name="roomId">
            <button class="enterRoom__form-button button">Ingresar a la sala</button>
          </form>

        </div>

        <div class="welcome__hands">
          <my-hands></my-hands> 
        </div>
      </section>
    `;
  }
}

customElements.define("access-room-page", AccesRoom);

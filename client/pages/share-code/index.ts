import { Router } from "@vaadin/router";
import { state } from "../../state";

class ShareCode extends HTMLElement {
  connectedCallback() {
    this.render();
    const cs = state.getState();

    state.setPlayer1ValuesRtdb();
    state.listenRoom();
    
    state.subscribe(() => {
      if (cs.dataRtdb[0].online == true && cs.dataRtdb[1].online == true && window.location.pathname == "/share-code") {
        Router.go("/waiting-opp");
      }
    });
  }
  render() {
    this.innerHTML = `
    <header class="shareCode-header">
    <div class="header-names">
    <my-text tag="h5">${state.data.user1Name}</my-text>
    <my-text class="opponent-name" tag="h5">${state.data.user2Name}</my-text>
    </div>
    <div class="header-rooms">
    <my-text tag="h5">Sala</my-text>
    <my-text tag="h5">${state.data.roomId}</my-text>
    </div>
    </header>
    
    <section class="shareCode">
    <div class="shareCode__text">
    <my-text tag="p">Compartí el código:</my-text>
    <my-text tag="h4" class="code">${state.data.roomId}</my-text>
    <my-text tag="p">Con tu contrincante</my-text>
    </div> 
    
    <div class="shareCode__hands">
    <my-hands></my-hands>
    </div>
    </section>
    
    `;
  }
}
customElements.define("share-code", ShareCode);

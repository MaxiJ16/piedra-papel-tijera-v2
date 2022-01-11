export class Button extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const button = document.createElement("button");
    button.textContent = this.textContent;
    button.className = "button";

    const style = document.createElement("style");
    style.innerHTML = `
    .button {
      width: 100%;
      color: var(--color-button-text);
      padding: 8px 0;
      font-size: 45px;
      font-family: "Odibee Sans", cursive;
      background-color: var(--color-button);;
      border: 10px solid #001997;
      border-radius: 10px;
    }

    `;

    this.shadow.appendChild(button);
    this.shadow.appendChild(style);
  }
}
customElements.define("my-button", Button);

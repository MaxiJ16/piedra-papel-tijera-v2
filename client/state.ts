type Jugada = "piedra" | "papel" | "tijera" | "";

const state = {
  data: {
    currentGame: {
      computerPlay: "",
      myPlay: "",
    },
    history: {
      user: 0,
      computer: 0,
    },
  },
  listeners: [],
  init() {
    const localData = localStorage.getItem("saved-state");
    const dataParse = JSON.parse(localData);

    if (dataParse == null) {
      const currentState = this.getState();
      this.setState(currentState);
    } else {
      this.setState(dataParse);
    }
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb(newState);
    }
    localStorage.setItem("saved-state", JSON.stringify(newState));
  },
  setMove(move: Jugada) {
    const currentState = this.getState();
    currentState.currentGame.myPlay = move;
    this.setState(currentState)
  },
  setComputerMove(move: Jugada) {
    const currentState = this.getState();
    currentState.currentGame.computerPlay = move;
    this.setState(currentState)
  },
  whoWins(myPlay: Jugada, computerPlay: Jugada) {
    const currentState = this.getState();

    const ganeConTijera = myPlay == "tijera" && computerPlay == "papel";
    const ganeConPiedra = myPlay == "piedra" && computerPlay == "tijera";
    const ganeConPapel = myPlay == "papel" && computerPlay == "piedra";

    const gane = [ganeConTijera, ganeConPiedra, ganeConPapel].includes(true);

    const perdiConTijera = myPlay == "papel" && computerPlay == "tijera";
    const perdiConPiedra = myPlay == "tijera" && computerPlay == "piedra";
    const perdiConPapel = myPlay == "piedra" && computerPlay == "papel";

    const perdi = [perdiConTijera, perdiConPapel, perdiConPiedra].includes(
      true
    );

    if (gane) {
      currentState.history.user++;
      return "Ganaste";
    } else if (perdi) {
      currentState.history.computer++;
      return "Perdiste";
    } else {
      return "Empate";
    }
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };

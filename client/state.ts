type Jugada = "piedra" | "papel" | "tijera" | "";

const API_BASE_URL = "https://piedra-papel-tijera.onrender.com" || "http://localhost:3000";

import { rtdb } from "./rtdb";
import map from "lodash/map";

const state = {
  data: {
    registerMessage: "",
    user1Name: "",
    user2Name: "",
    user1Id: "",
    user2Id: "",
    user1Online: false,
    user2Online: false,
    user1Start: "",
    user2Start: "",
    roomId: "",
    rtdbRoomId: "",
    dataRtdb: {},
    currentGame: {
      user1Move: "",
      user2Move: "",
    },
    history: {
      user1: 0,
      user2: 0,
    },
  },
  listeners: [],
  init() {
    const lastStorage = JSON.parse(sessionStorage.getItem("state"));

    if (lastStorage) {
      this.setState(lastStorage);
    } else {
      const cs = this.getState();
      this.setState(cs);
    }
  },
  getState() {
    return this.data;
  },
  setUser1Name(nameuser1: string) {
    const cs = this.getState();
    cs.user1Name = nameuser1;
    this.setState(cs);
  },
  setUser2Name(nameUser2: string) {
    const cs = this.getState();
    cs.user2Name = nameUser2;
    this.setState(cs);
  },
  register(name: string) {
    const cs = this.getState();

    fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ nombre: name }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        cs.registerMessage = data.message;
        this.setState(cs);
      });
  },
  signIn(callback) {
    const cs = this.getState();
    if (cs.user1Name) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ nombre: cs.user1Name }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.registerMessage = data.message;
          cs.user1Id = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      console.error("No hay un nombre en el state");
      callback();
    }
  },
  signInUser2(callback) {
    const cs = this.getState();
    if (cs.user2Name) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ nombre: cs.user2Name }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.registerMessage = data.message;
          cs.user2Id = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      console.error("No hay un nombre en el state");
      callback();
    }
  },
  askNewRoom(callback?) {
    const cs = this.getState();
    if (cs.user1Id) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.user1Id }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    }
    else {
      console.error("no hay userId");
    }
  },
  accessToRoom(callback?) {
    const cs = this.getState();
    const roomId = cs.roomId;
    const userId = cs.user1Id || cs.user2Id;
    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        this.listenRoom();
        if (callback) callback();
      });
  },
  listenRoom(callback?) {
    const cs = this.getState();
    const roomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);
    
    roomsRef.on("value", (snapshot) => {
      const currentState = this.getState();
      const currentGameFromServer = snapshot.val();
      const currentsList = map(currentGameFromServer.currentGame);
      cs.dataRtdb = currentsList;
      this.setState(currentState);
      if (callback) callback();
    });
  },
  setPlayer1ValuesRtdb() {
    const cs = this.getState();
    const roomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/currentGame");

    if (cs.user1Name && cs.user1Id) {
      roomsRef.update({
        user1: {
          name: cs.user1Name,
          online: true,
          userId: cs.user1Id,
        },
      });
      cs.user1Online = true;
    }

    this.setState(cs);
  },
  setPlayer2ValuesRtdb(callback?) {
    const cs = this.getState();
    const roomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/currentGame");

    if (cs.user2Name && cs.user2Id) {
      roomsRef.update({
        user2: {
          name: cs.user2Name,
          online: true,
          userId: cs.user2Id,
        },
      });
      cs.user2Online = true;
    }
    this.setState(cs);
    if (callback) callback();
  },
  startUser1(callback?) {
    const cs = this.getState();
    const roomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/currentGame");

    if (cs.user1Name && cs.user1Id) {
      roomsRef.update({
        user1: {
          name: cs.user1Name,
          online: true,
          userId: cs.user1Id,
          start: true,
        },
      });
      cs.user1Start = true;
    }

    this.setState(cs);
    if (callback) callback();
  },
  startUser2(callback?) {
    const cs = this.getState();
    const roomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/currentGame");

    if (cs.user2Name && cs.user2Id) {
      roomsRef.update({
        user2: {
          name: cs.user2Name,
          online: true,
          userId: cs.user2Id,
          start: true,
        },
      });
      cs.user2Start = true;
    }

    this.setState(cs);
    if (callback) callback();
  },
  setMoveUser1(move: Jugada) {
    const cs = this.getState();
    const roomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/currentGame");

    if (cs.user1Name) {
      roomsRef.update({
        user1: {
          name: cs.user1Name,
          online: true,
          userId: cs.user1Id,
          start: false,
          move,
        },
      });
      cs.currentGame.user1Move = move;
    }

    this.setState(cs);
  },
  setMoveUser2(move: Jugada) {
    const cs = this.getState();
    const roomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/currentGame");

    if (cs.user2Name) {
      roomsRef.update({
        user2: {
          name: cs.user2Name,
          online: true,
          userId: cs.user2Id,
          start: false,
          move,
        },
      });
      cs.currentGame.user2Move = move;
    }

    this.setState(cs);
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    sessionStorage.setItem("state", JSON.stringify(newState));
    console.log("Soy el state, he cambiado", this.data);
  },
  whoWins(user1Play: Jugada, user2Play: Jugada) {
    const cs = this.getState();

    const ganeConTijera = user1Play == "tijera" && user2Play == "papel";
    const ganeConPiedra = user1Play == "piedra" && user2Play == "tijera";
    const ganeConPapel = user1Play == "papel" && user2Play == "piedra";

    const gane = [ganeConTijera, ganeConPiedra, ganeConPapel].includes(true);

    const perdiConTijera = user1Play == "papel" && user2Play == "tijera";
    const perdiConPiedra = user1Play == "tijera" && user2Play == "piedra";
    const perdiConPapel = user1Play == "piedra" && user2Play == "papel";

    const perdi = [perdiConTijera, perdiConPapel, perdiConPiedra].includes(
      true
    );

    let results = "";

    if (gane) {
      cs.history.user1++;
      results = "Ganaste";
    } else if (perdi) {
      cs.history.user2++;
      results = "Perdiste";
    } else {
      results = "Empate";
    }

    const roomId = cs.roomId;

    fetch(API_BASE_URL + "/rooms/" + roomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ results }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {});

    return results;
  },
  restart() {
    const cs = state.getState();

    const roomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/currentGame");

    if (cs.user1Name) {
      roomsRef.update({
        user1: {
          name: cs.user1Name,
          online: true,
          userId: cs.user1Id,
          start: false,
          move: "",
        },
      });
    }

    if (cs.user2Name) {
      roomsRef.update({
        user2: {
          name: cs.user2Name,
          online: true,
          userId: cs.user2Id,
          start: false,
          move: "",
        },
      });
    }
    cs.currentGame.user1Move = "";
    cs.currentGame.user2Move = "";
    this.setState(cs);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };

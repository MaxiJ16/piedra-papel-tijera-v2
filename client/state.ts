type Jugada = "piedra" | "papel" | "tijera" | "";

const API_BASE_URL =
  "https://piedra-papel-tijera-mod6.herokuapp.com" || "http://localhost:3000";

import { rtdb } from "./rtdb";

import map from "lodash/map";

const state = {
  data: {
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

  register() {
    const cs = this.getState();
    if (cs.user1Name) {
      fetch(API_BASE_URL + "/signup", {
        // lo configuramos para hacer el método post
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ nombre: cs.user1Name }),
      })
        .then((res) => {
          // esto es una resp. de fetch así que hay que hacer un return de res.json
          // y recién ahí puedo hacer un .then más con la data que queremos
          return res.json();
        })
        .then((data) => {
          console.log(data);

          this.setState(cs);
        });
    }
  },
  signIn(callback) {
    const cs = this.getState();
    // si el current State tiene un email vamos a authenticarlo
    if (cs.user1Name) {
      // el auth nos devuelve el id que tiene ese email
      fetch(API_BASE_URL + "/auth", {
        // lo configuramos para hacer el método post
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ nombre: cs.user1Name }),
      })
        .then((res) => {
          // esto es una resp. de fetch así que hay que hacer un return de res.json
          // y recién ahí puedo hacer un .then más con la data que queremos
          return res.json();
        })
        .then((data) => {
          // data nos va a traer el id que nos devuelve /auth cuando el user está registrado
          cs.user1Id = data.id;
          this.setState(cs);
          // cuando se termine de setear el state voy a invocar al callback, sin error
          callback();
        });
    } else {
      // si no existe el email
      console.error("No hay un nombre en el state");
      // invoco el callback cuando hubo un error
      callback();
    }
  },
  signInUser2(callback) {
    const cs = this.getState();
    // si el current State tiene un email vamos a authenticarlo
    if (cs.user2Name) {
      // el auth nos devuelve el id que tiene ese email
      fetch(API_BASE_URL + "/auth", {
        // lo configuramos para hacer el método post
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ nombre: cs.user2Name }),
      })
        .then((res) => {
          // esto es una resp. de fetch así que hay que hacer un return de res.json
          // y recién ahí puedo hacer un .then más con la data que queremos
          return res.json();
        })
        .then((data) => {
          // data nos va a traer el id que nos devuelve /auth cuando el user está registrado
          cs.user2Id = data.id;
          this.setState(cs);
          // cuando se termine de setear el state voy a invocar al callback, sin error
          callback();
        });
    } else {
      // si no existe el email
      console.error("No hay un nombre en el state");
      // invoco el callback cuando hubo un error
      callback();
    }
  },
  // va a hacer el método del nuevo room y nosotros tenemos que hacer el de room existente porque es basicamente igual
  //nuestro estado le pide al server un nuevo room
  askNewRoom(callback?) {
    const cs = this.getState();
    // si tiene userId
    if (cs.user1Id) {
      fetch(API_BASE_URL + "/rooms", {
        // lo configuramos para hacer el método post
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.user1Id }),
      })
        .then((res) => {
          // pasamos la res de la api a json, sino es un texto
          return res.json();
        })
        .then((data) => {
          // data nos va a traer el id sencillo que nos devuelve /rooms
          cs.roomId = data.id;
          this.setState(cs);
          // tmb recibimos un callback porque queremos avisar que el newRoom está creado para que vaya otra vez a la APi a pedirle el id complejo
          if (callback) {
            callback();
          }
        });
    }
    // si no tiene userId
    else {
      console.error("no hay userId");
    }
  },
  // el callback es porque le vamos a tener que avisar al exterior que esto ya terminó para que después pueda empezar a intercambiar mensajes
  accessToRoom(callback?) {
    const cs = this.getState();
    const roomId = cs.roomId;
    const userId = cs.user1Id || cs.user2Id;
    // invocamos el fetch a la api /room/ (lo que me pasen como parametro) y ademas nos pide que le agreguemos el userId
    // el método get es por defecto así que no hace falta aclarar el method
    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
      .then((res) => {
        // pasamos la res de la api a json, sino es un texto
        return res.json();
      })
      .then((data) => {
        // data nos va a traer el id largo de la rtdb, lo guardamos en el state
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        // y nos conectamos a ese room
        this.listenRoom();
        if (callback) callback();
      });
  },
  listenRoom() {
    const cs = this.getState();
    //de la rtdb quiero escuchar una sección dentro de rooms/${rtdbRoomId} y ahí vamos a escribir los msj en el backend
    const roomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);
    roomsRef.on("value", (snapshot) => {
      const currentState = this.getState();
      // cuando message recibe un nuevo valor recibimos el snapshot y lo guardamos en messagesFromServer
      const currentGameFromServer = snapshot.val();
      // cada vez que haya un cambio vamos a traernos del server solo la parte de messages y la vamos a guardar en el state
      // primero lo tenemos que mapear
      const currentsList = map(currentGameFromServer.currentGame);
      cs.dataRtdb = currentsList;

      this.setState(currentState);
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

    if (cs.user1Name && cs.user1Id) {
      roomsRef.update({
        user1: {
          name: cs.user2Name,
          online: true,
          userId: cs.user2Id,
          start: true,
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

    if (cs.user2Name && cs.user2Id) {
      roomsRef.update({
        user2: {
          name: cs.user2Name,
          online: true,
          userId: cs.user2Id,
          start: true,
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
      cs.history.user++;
      results = "Ganaste";
    } else if (perdi) {
      cs.history.userTwo++;
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
      .then((data) => {
        console.log(data);
      });

    return results;
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };

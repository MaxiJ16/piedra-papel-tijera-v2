import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "dVIrWVWVHWaZYbvBaFEJN9tfTsGusbPgr5lNW5hG",
  databaseURL: "https://desafio-final-m6-default-rtdb.firebaseio.com",
  projectId: "desafio-final-m6",
  authDomain: "desafio-final-m6.firebaseapp.com",
});

const rtdb = firebase.database();

export { rtdb };

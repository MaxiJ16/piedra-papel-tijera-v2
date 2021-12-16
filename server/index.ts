import * as express from "express";
import * as cors from "cors";

import { rtdb, firestore } from "./db";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("../dist"));
app.use(cors());

const collection = firestore.collection("prueba");
const pruebaDoc = collection.doc("prueba");

const refPrueba = rtdb.ref("Prueba");

app.get("/", (req, res) => {
  pruebaDoc.get().then((snap) => {
    const pruebaData = snap.data();
    res.send(pruebaData);
  });
});

app.get("/rtdb", (req, res) => {
  refPrueba.on("value", (snapshot) => {
    const data = snapshot.val();
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`Server on: http://localhost:${port}`);
});

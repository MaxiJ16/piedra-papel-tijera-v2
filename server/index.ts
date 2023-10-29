import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import { nanoid } from "nanoid";

import { rtdb, firestore } from "./db";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

app.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
  });
});


const userCollection = firestore.collection("users");
const roomCollection = firestore.collection("rooms");

// Alta de Usuario en Firestore
app.post("/signup", (req, res) => {
  const { nombre } = req.body;
  userCollection
    .where("nombre", "==", nombre)
    .get()
    .then((searchResponse) => {
      // Empty = si no existe
      if (searchResponse.empty) {
        userCollection
          .add({
            nombre,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
              new: true,
              message: "Usuario registrado con éxito",
            });
          });
      } else {
        res.status(400).json({
          message: "Este usuario ya existe, prueba otro nombre",
        });
      }
    });
});

app.post("/auth", (req, res) => {
  const { nombre } = req.body;
  userCollection
    .where("nombre", "==", nombre)
    .get()
    .then((searchResponse) => 
      if (searchResponse.empty) {
        res.status(404).json({
          message: "user not found",
        });
      } else {
        res.json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});


// Crea un room en Firestore y en la Realtime Database y nos devuelve un id mas sencillo.
app.post("/rooms", (req, res) => {
  const { userId } = req.body;

  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + nanoid());
       
        roomRef
          .set({
            currentGame: {
              user1: {
                name: "",
                userId: "",
                choice: "",
                online: false,
                start: false,
              },
              user2: {
                name: "",
                userId: "",
                choice: "",
                online: false,
                start: false,
              },
            },
            owner: userId,
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            
            roomCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
                history: {
                  user1: 0,
                  user2: 0,
                },
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      }
      else {
        res.status(401).json({
          message: "no existis en la base de datos",
        });
      }
    });
});

// Retorna el id complejo y la data del room.
app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.query;

  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            const data = snap.data();
            res.json(data);
          });
      }
      else {
        res.status(401).json({
          message: "no existis en la base de datos",
        });
      }
    });
});

// Aumenta el contador en la RTDB.
app.post("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { results } = req.body;

  roomCollection
    .doc(roomId.toString())
    .get()
    .then((room) => {
      if (room.exists) {
        const roomData = room.data();

        if (results == "Ganaste") {
          roomData.history.user1 += 1;
        }

        if (results == "Perdiste") {
          roomData.history.user2 += 1;
        }

        if (results == "Empate") {
          roomData.history.user1 += 0;
          roomData.history.user2 += 0;
        }

        roomCollection.doc(roomId.toString()).update(roomData);
        res.json(roomData);
      } else {
        res.status(401).json({
          message: "La room ingresada no existe.",
        });
      }
    });
});

app.get("*", (req, res) => {
  const pathResolve = path.resolve("", "dist/index.html");
  res.sendFile(pathResolve);
});

app.listen(port, () => {
  console.log(`Server on: http://localhost:${port}`);
});

import * as express from "express";

import * as path from "path";

import * as cors from "cors";

import { rtdb, firestore } from "./db";

import { nanoid } from "nanoid";

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


// zona de producción

const userCollection = firestore.collection("users");
const roomCollection = firestore.collection("rooms");

// damos de alta el usuario en firestore

app.post("/signup", (req, res) => {
  const { nombre } = req.body;
  userCollection
    .where("nombre", "==", nombre)
    .get()
    .then((searchResponse) => {
      // empty = si no existe
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
  // una vez que lo tenemos buscamos nuevamente en la userCollection
  userCollection
    .where("nombre", "==", nombre)
    .get()
    .then((searchResponse) => {
      // si la respuesta está vacía quiere decir que no hay un usuario registrado y no encontró el nombre
      if (searchResponse.empty) {
        // respondemos el error 404
        res.status(404).json({
          message: "user not found",
        });
      } else {
        // si no está vacío y encontró el nombre le mostramos el registro que encontró en la búsqueda
        res.json({
          //searchResponse devuelve un array, entonces debemos buscarlo en la posición 0
          id: searchResponse.docs[0].id,
        });
      }
    });
});

// /rooms: este endpoint va a crear un room en Firestore y en la Realtime Database y nos devuelve un id mas sencillo.
// En la primera va a guardar el id corto (AAFF, por ejemplo) y lo va a asociar a un id complejo que estará en la Realtime DB.

app.post("/rooms", (req, res) => {
  // obtenemos del body el userId, este es requerido para poder crear un room
  // si no tenemos un userId no podemos crear una nueva room
  const { userId } = req.body;
  // dentro de la userCollection buscamos un doc que tenga el userId que nos acaban de pasar
  userCollection
    // para que no haya errores vamos a parsear a un string lo que nos pasen como userId
    .doc(userId.toString())
    .get()
    .then((doc) => {
      // si ese documento que buscamos existe
      if (doc.exists) {
        // creamos dentro de la rtdb una referencia a rooms/(idcomplejo)
        const roomRef = rtdb.ref("rooms/" + nanoid());
        // este set inicializa una room con estas propiedades
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
            // guardamos el id complejo del room que se creo en la rtdb
            const roomLongId = roomRef.key;
            // después de haber creado la room en la rtdb, cramos un doc en la roomCollection que va a tener un id mas sencillo que el otro
            // generación del id:
            // para que sea de 4 cifras le ponemos el num 1000, y le sumamos un numero entre el 1 y el 999
            // math.random nos da un num entre 0 y 1, entonces lo vamos a multiplicar * 999
            // y todo eso lo vamos a redondear con math.floor
            const roomId = 1000 + Math.floor(Math.random() * 999);
            // ese roomId es el id del doc que voy a crear en la roomCollection
            roomCollection
              .doc(roomId.toString())
              .set({
                // y dentro le ponemos el id complejo asociado
                rtdbRoomId: roomLongId,
                history: {
                  user1: 0,
                  user2: 0,
                },
              })
              .then(() => {
                res.json({
                  // respondemos con el id cortito de firestore
                  id: roomId.toString(),
                });
              });
          });
      }
      // si no existe el userId
      else {
        res.status(401).json({
          message: "no existis en la base de datos",
        });
      }
    });
});

// /room/:id

// /rooms/:roomId?userid=1234: por último, este endpoint va a recibir el id “amigable” (AAFF)
// y va devolver el id complejo (el de la RTDB) y la data del room.
// Además va a exigir que un userId válido acompañe el request.

app.get("/rooms/:roomId", (req, res) => {
  // recibe un roomid amigable de params
  const { roomId } = req.params;
  // además va a recibir un parametro adicional que va a ser el id del usuario que quiere obtener eso para que sea seguro
  // recibe una queryparams, de req.query obtenemos el userId
  const { userId } = req.query;

  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        // buscamos en firestore en la roomCollection
        // le decimos a la roomCollection que queremos el doc que tenga este id
        roomCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            // obtenemos la data del snap con el método data
            const data = snap.data();
            // le decimos que responda con ese data
            res.json(data);
          });
      }
      // si no existe el userId
      else {
        res.status(401).json({
          message: "no existis en la base de datos",
        });
      }
    });
});

// para aumentar el contador en la rtdb

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


// le indicamos una ruta especial al archivo
app.get("*", (req, res) => {
  const pathResolve = path.resolve("", "dist/index.html");
  res.sendFile(pathResolve);
});

app.listen(port, () => {
  console.log(`Server on: http://localhost:${port}`);  
});

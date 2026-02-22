// Añadimos el paquete "dotenv" que hemos instalado para poder usar el archivo .env con las variables del proyecto
require("dotenv").config();
//Añadimos el paquete express
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes")

const app = express();

// Para probar que funciona correctamente, en entorno de desarrollo (al subir a PROD debe eliminarse), se añade este test
// Al cargar la raíz del proyecto, nos devuelve un OK
app.get("/", (req, res) => {
  res.send("OK -> BACKEND FUNCIONANDO");
});

app.use(cors())
app.use(express.json())

// Añadimos las rutas del router para usuarios
app.use("/api/users", userRoutes)

const PORT = "3000";
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

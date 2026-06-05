import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import 'dotenv/config';
import tareasRouter from "./routes/tareasRoutes.js";
import usuariosRouter from "./routes/usuariosRoutes.js";

const CLAVE_SECRETA =  process.env.JWT_SECRET;
const app = express();
app.use(cors());

app.use(express.json())


/*🌟 RUTA DEL SERVIDOR */
app.get("/", (req, res) => {

    res.send("Servidor funcionando");

});

app.use(usuariosRouter); 
app.use(tareasRouter);

/*🌟 Escuchar servidor */
app.listen(3000, () => {

    console.log("Servidor en http://localhost:3000");

});
import express from "express";
import cors from "cors";
import miConexion from './db.js';

const app = express();
app.use(cors());

app.use(express.json())

/*🌟 RUTA DEL SERVIDOR */
app.get("/", (req, res) => {

    res.send("Servidor funcionando");

});




/*🌟 RUTA DEL SERVIDOR */

app.post("/registro", (req, res) =>{

    const correo_user = req.body.correo;
    const pass_user = req.body.password;

    if(correo_user && pass_user){

        res.json({
            correo : correo_user,
            contraseña : pass_user 
        });
    } else{

        res.status(400).json({
            error : "Correo y contraseña requeridos"
        });
    }
});

/*🌟 Escuchar servidor */
app.listen(3000, () => {

    console.log("Servidor en http://localhost:3000");

});
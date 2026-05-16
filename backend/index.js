import express from "express";
import cors from "cors";
import connection from './db.js';
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());

app.use(express.json())

/*🌟 RUTA DEL SERVIDOR */
app.get("/", (req, res) => {

    res.send("Servidor funcionando");

});




/*🌟 RUTA PARA REGISTRO */

app.post("/registro", async (req, res) =>{

    const correo_user = req.body.correo;
    const pass_user = req.body.password;

    if(correo_user && pass_user){
       const saltRounds = 10;
       
       const passwordEncriptado = await bcrypt.hash(pass_user, saltRounds);

        const registrar = 'INSERT INTO Usuarios (correo, password) VALUES(?, ?)';
        const [resultado] = await connection.execute(registrar, [correo_user,passwordEncriptado]);

        res.status(201).json({
            id:resultado.insertId,
            correo : correo_user,
           
        });
    } else{

        res.status(400).json({
            error : "Correo y contraseña requeridos"
        });
    }
});

    /*RUTA PARA LOGIN */

    app.post("/login", async (req,res) =>{

        const correo_usuario = req.body.correo;
        const pass_usuario = req.body.password;

        const sql_consulta = 'SELECT password FROM Usuarios WHERE correo = ? LIMIT 1';

        const [consulta_correo] = await connection.execute(sql_consulta, [correo_usuario]);

        if(consulta_correo.length > 0){

            res.status(200);

            /*validacion de contraseña */

            const coinciden = await bcrypt.compare(pass_usuario, consulta_correo[0].password);
            if(coinciden){

                res.json({
                    mensaje: "La contraseña coincide"
                }).status(200);
            } else{

                res.json({
                    mensaje: "La contraseña no coincide"
                }).status(401)
            }
        } else{

            res.json({
                error: `No se encontro ninguna coincidencia`
            }).status(401)
        }
    })

/*🌟 Escuchar servidor */
app.listen(3000, () => {

    console.log("Servidor en http://localhost:3000");

});
import express from "express";
import cors from "cors";
import connection from './db.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const CLAVE_SECRETA =  "VictoriaGalletaLaneyYumiLunaBrisaYokoYEMOreoWaltKATSUMOTO"
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

    /*🌟RUTA PARA LOGIN */

    app.post("/login", async (req,res) =>{

        const correo_usuario = req.body.correo;
        const pass_usuario = req.body.password;

        const sql_consulta = 'SELECT id, password FROM Usuarios WHERE correo = ? LIMIT 1';

        const [consulta_correo] = await connection.execute(sql_consulta, [correo_usuario]);

        if(consulta_correo.length > 0){

            res.status(200);

            /*validacion de contraseña */

            const coinciden = await bcrypt.compare(pass_usuario, consulta_correo[0].password);

            
            if(coinciden){
                const payload = {
                 correo: correo_usuario,
                    usuario_id:consulta_correo[0].id
            }

            const token = jwt.sign(payload, CLAVE_SECRETA, {expiresIn:'2h'} )

                res.json({
                    mensaje: "La contraseña coincide",
                    correo: correo_usuario,
                    token:token
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

/*🌟 RUTA PARA DASHBOARD */

app.post("/tareas", async (req, res) =>{

    try{

    

    const texto_tarea = req.body.texto;

    const token = req.body.token;

    if(!token || !texto_tarea){

        return res.status(400).json({
            error : "Falta uno de los datos (token o tarea)"
        })
    }

    const datos_token = jwt.verify(token, CLAVE_SECRETA);

    const id_usuario = datos_token.id;

    const estado = "Pendiente";
    const consulta_tareaInsert = 'INSERT INTO tareas (texto, completada, usuario_id) VALUES( ?, ?,?)';
    const insert_tarea =await connection.execute(consulta_tareaInsert, [texto_tarea, estado,id_usuario]);

    
    if (insert_tarea){

        res.json({
            mensaje:"Se creo la tarea exitosamente"
        }).status(201);
    } else{
        res.json({
            error : "No se creo la tarea"
        }).status(401)
    }
    }catch(e){ 

        console.error(e);
        return res.status(401).json({
            error:"Token invalido, expirado o error en el servidor"
        })
    }

})

/*🌟OBTENER TAREAS */

app.get("/tareas/:usuarioId", async (req,res) =>{

    const id_usuario = req.params.usuarioId;
    
    const consulta_tareas = 'SELECT texto FROM tareas WHERE usuario_id = ?';

    try{

        const [resultados] = await connection.execute(consulta_tareas, [id_usuario]);

        res.status(200).json({
            mensaje: `Se encontraron tus tareas`,
            tareas: resultados
        })

    }catch(e){
        res.status(404).json({
            error:`Hubo un error al Obtener tus tareas: ${e}`
        });
    }
    
})

/*🌟ELIMINAR TAREAS */

app.delete("/tareas/:id", async (req, res) =>{

    const id_tarea = req.params.id;

    try{
        const sql_consulta = 'DELETE FROM tareas WHERE id = ?'

    const [resultado] = await connection.execute(sql_consulta, [id_tarea]);

    res.status(200).json({
        mensaje: "Se elimino la tarea con exito"
    });
    }catch(e){
        res.status(404).json({
            error:`No se elimino la tarea de manera correcta: ${e}`
        });
    }
})

/*🌟 Escuchar servidor */
app.listen(3000, () => {

    console.log("Servidor en http://localhost:3000");

});
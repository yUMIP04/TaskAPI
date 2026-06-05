
import connection from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const CLAVE_SECRETA = process.env.JWT_SECRET;


const registrarUsuario = async (req, res) => {
    const correo_user = req.body.correo;
    const pass_user = req.body.password;

    if (correo_user && pass_user) {
        try {
            const saltRounds = 10;
            const passwordEncriptado = await bcrypt.hash(pass_user, saltRounds);

            const registrar = 'INSERT INTO Usuarios (correo, password) VALUES(?, ?)';
            const [resultado] = await connection.execute(registrar, [correo_user, passwordEncriptado]);

            res.status(201).json({
                id: resultado.insertId,
                correo: correo_user,
            });
        } catch (e) {
            res.status(500).json({ error: `Error al registrar en la BD: ${e.message}` });
        }
    } else {
        res.status(400).json({ error: "Correo y contraseña requeridos" });
    }
};


const loginUsuario = async (req, res) => {
    const correo_usuario = req.body.correo;
    const pass_usuario = req.body.password;

    try {
        const sql_consulta = 'SELECT id, password FROM Usuarios WHERE correo = ? LIMIT 1';
        const [consulta_correo] = await connection.execute(sql_consulta, [correo_usuario]);

        if (consulta_correo.length > 0) {
            /* validación de contraseña */
            const coinciden = await bcrypt.compare(pass_usuario, consulta_correo[0].password);

            if (coinciden) {
                const payload = {
                    correo: correo_usuario,
                    id: consulta_correo[0].id
                };

                const token = jwt.sign(payload, CLAVE_SECRETA, { expiresIn: '2h' });

                res.status(200).json({
                    mensaje: "La contraseña coincide",
                    correo: correo_usuario,
                    token: token
                });
            } else {
                res.status(401).json({ mensaje: "La contraseña no coincide" });
            }
        } else {
            res.status(401).json({ error: "No se encontro ninguna coincidencia" });
        }
    } catch (e) {
        res.status(500).json({ error: `Error en el servidor: ${e.message}` });
    }
};

export { registrarUsuario, loginUsuario };
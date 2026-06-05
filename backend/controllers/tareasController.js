/* 🧠 CONTROLADOR DE TAREAS */
import connection from "../db/db.js";

// 1. OBTENER / PINTAR TAREAS
const obtenerTareas = async (req, res) => {
    try {
        // El id viene del guardia (middleware) que descifró el token
        const id_usuario = req.usuario.id; 
        const consulta = "SELECT id, texto FROM tareas WHERE usuario_id = ?";

        const [resultados] = await connection.execute(consulta, [id_usuario]);

        return res.status(200).json({
            mensajes: "Se encontraron tareas",
            tareas: resultados
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            error: "Error en el servidor al obtener tareas"
        });
    }
};

// 2. AGREGAR TAREA
const agregarTarea = async (req, res) => {
    try {
        const texto_tarea = req.body.texto;
        const id_usuario = req.usuario.id;
        const estado = "Pendiente";

        if (!texto_tarea) {
            return res.status(400).json({ error: "Falta el texto de la tarea" });
        }

        const consulta_tareaInsert = 'INSERT INTO tareas (texto, completada, usuario_id) VALUES(?, ?, ?)';
        const [resultado] = await connection.execute(consulta_tareaInsert, [texto_tarea, estado, id_usuario]);

        if (resultado) {
            res.status(201).json({
                mensaje: "Se creo la tarea exitosamente",
                id_tarea: resultado.insertId // Pasamos el ID para tu botón eliminar del front
            });
        } else {
            res.status(400).json({ error: "No se creo la tarea" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Error interno en el servidor" });
    }
};

// 3. ELIMINAR TAREA
const eliminarTarea = async (req, res) => {
    const id_tarea = req.params.id;

    try {
        const sql_consulta = 'DELETE FROM tareas WHERE id = ?';
        await connection.execute(sql_consulta, [id_tarea]);

        res.status(200).json({
            mensaje: "Se eliminó la tarea con éxito"
        });
    } catch (e) {
        res.status(500).json({
            error: `No se elimino la tarea de manera correcta: ${e.message}`
        });
    }
};

// Exportamos las tres funciones juntas
export { obtenerTareas, agregarTarea, eliminarTarea };
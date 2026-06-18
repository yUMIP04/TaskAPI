
import connection from "../db/db.js";


const obtenerTareas = async (req, res) => {
    try {
       
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


const agregarTarea = async (req, res) => {
    try {
        const texto_tarea = req.body.texto;
        const id_usuario = req.usuario.id;
        const fecha_limite = req.body.fecha_limite;
        const estado = "Pendiente";

        if (!texto_tarea) {
            return res.status(400).json({ error: "Falta el texto de la tarea" });
        }

        const consulta_tareaInsert = 'INSERT INTO tareas (texto, completada, usuario_id, fecha_limite) VALUES(?, ?, ?, ?)';
        const fecha_final =(fecha_limite && fecha_limite.trim() !== "") ? fecha_limite : null;
        const [resultado] = await connection.execute(consulta_tareaInsert, [texto_tarea, estado, id_usuario, fecha_final]);

        if (resultado) {
            res.status(201).json({
                mensaje: "Se creo la tarea exitosamente",
                id_tarea: resultado.insertId
            });
        } else {
            res.status(400).json({ error: "No se creo la tarea" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Error interno en el servidor" });
    }
};


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

const buscarTarea = async (req,res) => {
    const nombre_tarea = req.query.nombre;
    const id_usuario = req.usuario.id;
    try{

        if (!nombre_tarea || nombre_tarea.trim() === ""){

            return res.status(400).json({
                error: "Debes ingresar un termino de busqueda"
            });
        }
        const sql_consulta = 'SELECT * FROM tareas WHERE usuario_id = ? AND texto LIKE ?'
        const [resultados] = await connection.execute(sql_consulta, [id_usuario, `%${nombre_tarea}%`]);

        if (resultados.length === 0){
            return res.status(404).json({
                mensaje: "No se encontraron tareas que coincidan"
            });
        }
        
        res.status(200).json({
            mensaje: "Se encontro una coincidencia",
            tareas: resultados
        })
    }catch(e){
        console.error(`Hubo un error al buscar la tarea en la BD: ${e}`);
        res.status(500).json({
            error:`No se encontro ninguna coincidencia`
        });
    }
}

export { obtenerTareas, agregarTarea, eliminarTarea, buscarTarea };
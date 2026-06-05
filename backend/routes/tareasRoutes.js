/* 🧭 RUTAS DE TAREAS */
import express from "express";

import { obtenerTareas, agregarTarea, eliminarTarea } from "../controllers/tareasController.js"; 
// Importamos al guardia de seguridad
import { verificarToken } from "../middleware/autenticacion.js"; 

const router = express.Router();

// 👮‍♂️ Todas estas rutas llevan al guardia 'verificarToken' antes de ejecutar su acción
router.get("/obtener-tareas", verificarToken, obtenerTareas);
router.post("/tareas", verificarToken, agregarTarea);
router.delete("/tareas/:id", verificarToken, eliminarTarea);

export default router;
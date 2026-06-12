
import express from "express";

import { obtenerTareas, agregarTarea, eliminarTarea } from "../controllers/tareasController.js"; 

import { verificarToken } from "../middleware/autenticacion.js"; 

const router = express.Router();


router.get("/obtener-tareas", verificarToken, obtenerTareas);
router.post("/tareas", verificarToken, agregarTarea);
router.delete("/tareas/:id", verificarToken, eliminarTarea);

export default router;
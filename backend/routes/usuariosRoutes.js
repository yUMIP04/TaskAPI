/* 🧭 RUTAS DE USUARIOS */
import express from "express";
import { registrarUsuario, loginUsuario } from "../controllers/usuariosControllers.js";

const router = express.Router();


router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);

export default router;
/* 🛡️ MIDDLEWARE DE AUTENTICACIÓN (EL GUARDIA) */
import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
   
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    try {
       
        const token_verificar = jwt.verify(token, process.env.JWT_SECRET);
        
        if (token_verificar) {
           
            req.usuario = token_verificar; 
            
            next(); 
        }
    } catch (e) {
        return res.status(401).json({
            error: `Token inválido o expirado: ${e.message}`
        });
    }
};

export { verificarToken };
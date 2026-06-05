import mysql from 'mysql2/promise'
import 'dotenv/config';

let connection;
try{ 

connection = await mysql.createConnection({
    
    host:process.env.HOSTDB,
    user:process.env.USERDB,
    password:process.env.passwordDB,
    database:process.env.DATABASE

});

console.log("🥳 Se logro la conexion a la BD");
 const [prueba] = await connection.query('SELECT  "Hola desde MYSQL" AS mensaje');
    console.log("Resultado del SELECT: " + prueba[0].mensaje);

    const tabla_usuarios =await connection.query(`
        CREATE TABLE IF NOT EXISTS Usuarios(
        id INT AUTO_INCREMENT PRIMARY KEY,
         correo VARCHAR(255) NOT NULL, 
         password VARCHAR(255) NOT NULL)`);

         console.log("📋 La tabla Usuarios se creo correctamente");

    /*🌟tabla tareas */

    const tabla_Tarea = await connection.query(`
        CREATE TABLE IF NOT EXISTS tareas(
        id INT AUTO_INCREMENT PRIMARY KEY,
        texto VARCHAR(255) NOT NULL,
        completada VARCHAR(255) NOT NULL,
        usuario_id INT,
        FOREIGN KEY(usuario_id) REFERENCES Usuarios(id)
        )
        `);
        console.log("📋 La tabla tareas se creo correctamente");
}catch(e){

    console.error(`Hubo un error al conectarse a la BD: ${e}`);
}

export default connection;
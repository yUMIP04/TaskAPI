import mysql from 'mysql2/promise'

let connection;
try{ 

connection = await mysql.createConnection({
    
    host:'localhost',
    user:'root',
    password:'',
    database:'taskflowapi'

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
}catch(e){

    console.error(`Hubo un error al conectarse a la BD: ${e}`);
}

export default connection;
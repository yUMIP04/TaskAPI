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
}catch(e){

    console.error(`Hubo un erro al conectarse a la BD: ${e}`);
}

export default connection;
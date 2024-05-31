const mysql = require('mysql2');


const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Admin1234",
    database: "tiendaweb"
  })

conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
  });

module.exports = conexion;
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cesargoop",
    database: "tiendaweb"
});

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'Content-Type'],
    credentials: true
}));

conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

app.get('/juegos', (req, res) => {
    conexion.query('SELECT * FROM juegos', (err, resultados) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).json({ error: 'Error al realizar la consulta' });
            return;
        }
        res.json(resultados);
    });
});

app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});

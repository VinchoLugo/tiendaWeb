const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
/*const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin1234",
  database: "tiendaweb"
});*/

//Middleware para servir archivos estáticos
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['X-Requested-With', 'Content-Type'],
  credentials: true
}));
/*
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
*/
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Enrutador para manejar las rutas de las páginas
const pageRouter = require("./routes/pagesRoutes");
const steamRoutes = require('./routes/steamRoutes');
app.use('/', pageRouter);
app.use('/steam', steamRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

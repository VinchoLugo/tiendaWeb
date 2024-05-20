const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Definir la ruta estática para servir archivos desde el directorio frontend/public
app.use(express.static(path.join(__dirname, '..', 'frontend'), {
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));
  
// Ruta para servir la página home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'wishlist.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

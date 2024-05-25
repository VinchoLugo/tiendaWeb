const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'Frontend'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'pages', 'home.html'));
});

app.get('/register', (req,res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'pages', 'register.html'))
});

app.get('/login', (req,res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'pages', 'login.html'))
})


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

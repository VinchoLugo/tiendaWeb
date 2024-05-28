const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


const app = express();


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

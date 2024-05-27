const express = require("express");
const router = express.Router();
const path = require('path');
const mysql = require('mysql2');
/*const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin1234",
    database: "tiendaweb"
  });*/
// Middleware para servir archivos estáticos desde el directorio frontend
router.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

// Manejar la solicitud GET para la página gameinfo.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'home.html'));
});

router.get('/gameinfo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'gameinfo.html'));
});

router.get('/cards', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'cards.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'login.html'));
    
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'register.html'));
});

router.get('/wishlist', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'wishlist.html'));
});
module.exports = router;

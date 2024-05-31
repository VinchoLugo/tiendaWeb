const express = require("express");
const router = express.Router();
const path = require('path');
const userController = require('../controllers/userController');
const passwordController = require('../controllers/passwordController');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

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

router.get('/requestNewPassword', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'requestNewPassword.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'register.html'));
});

router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);

router.post('/register', userController.registerUser);

// Rutas para recuperación de contraseña
router.post('/forgot-password', passwordController.sendResetEmail);
router.get('/resetPassword/:token', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'resetPassword.html'));
});

<<<<<<< HEAD
router.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'shoppingcart.html'));
});
=======
router.post('/resetPassword', passwordController.resetPassword);

router.get('/get-user', (req, res) => {
    if (req.session.user && req.session.user.email) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: 'Usuario no autenticado' });
    }
});

>>>>>>> 9622e2fe00112766ecb9524133826d8d69d4ce89
module.exports = router;

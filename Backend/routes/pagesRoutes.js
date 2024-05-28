const express = require("express");
const router = express.Router();
const path = require('path');
const userController = require('../controllers/userController');
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

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'register.html'));
});

router.get('/purchase', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', 'purchase.html'));
});


router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);

router.post('/register', userController.registerUser);

router.get('/get-user', (req, res) => {
    if (req.session.user && req.session.user.email) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: 'Usuario no autenticado' });
    }
});




module.exports = router;

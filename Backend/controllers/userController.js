const bcrypt = require('bcryptjs');
const conexion = require('../services/db');

// Función para registrar un usuario
const registerUser = async (req, res) => {
    const { userName, email, contrasena } = req.body;
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const sql = 'INSERT INTO users (user, email, contrasena) VALUES (?, ?, ?)';
    conexion.query(sql, [userName, email, hashedPassword], (err, result) => {
        if (err) {
            console.log('Error al insertar los usuarios', err);
            return res.status(500).send('Error al registrar usuario');
        }
        console.log('Usuario registrado');
        res.redirect('/login');
    });
};

// Función para iniciar sesión
const loginUser = async (req, res) => {
    const { email, contrasena } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    conexion.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Error al buscar el usuario en la base de datos:', err);
            return res.status(500).send('Error interno del servidor');
        }

        if (results.length === 0) {
            return res.status(404).send('El correo electrónico proporcionado no está registrado');
        }

        const usuario = results[0];
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contrasenaValida) {
            return res.status(401).send('La contraseña proporcionada es incorrecta');
        }

        req.session.user = { id: usuario.id, user: usuario.user, email: usuario.email }; // Asegúrate de que el ID del usuario se guarda en la sesión
        console.log('Usuario logeado:', req.session.user); 
        res.redirect('/');
    });
};

// Función para cerrar sesión
const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/');
    });
};


// Función para obtener el carrito de compras y el historial de compras de un usuario
const getUserData = (req, res) => {
    const userId = req.session.user.id; // Obtener el ID del usuario de la sesión
    const cartQuery = 'SELECT * FROM carts WHERE user_id = ?';
    const historyQuery = 'SELECT * FROM purchase_history WHERE user_id = ?';

    conexion.query(cartQuery, [userId], (err, cartResults) => {
        if (err) {
            console.log('Error al obtener el carrito de compras:', err);
            return res.status(500).send('Error al obtener el carrito de compras');
        }
        conexion.query(historyQuery, [userId], (err, historyResults) => {
            if (err) {
                console.log('Error al obtener el historial de compras:', err);
                return res.status(500).send('Error al obtener el historial de compras');
            }
            const cart = cartResults.map(item => ({ appid: item.appid, quantity: item.quantity }));
            const history = historyResults.map(item => ({
                appid: item.appid,
                purchaseDate: item.purchase_date,
                quantity: item.quantity,
                price: item.price
            }));
            res.json({ cart, history });
        });
    });
};



module.exports = { registerUser, loginUser, logoutUser, getUserData };

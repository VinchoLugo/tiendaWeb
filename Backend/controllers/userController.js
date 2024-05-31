const bcrypt = require('bcryptjs');
const conexion = require('../services/db');

//Agregar nombre de usuario tambien en la base de datos**
//Modificar la tabla de la base de la base de datos**
//name es userName en el html
const registerUser = async (req, res) => {
    const { userName, email, contrasena } = req.body;
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    //Modificar sql
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

        req.session.user = { user: usuario.user, email: usuario.email }; 
        console.log('Usuario logeado:', req.session.user); 
        res.redirect('/');
    });
};


const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/');
    });
};

module.exports = { registerUser, loginUser, logoutUser };

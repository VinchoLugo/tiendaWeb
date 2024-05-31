const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const conexion = require('../services/db');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
    },
});

const sendResetEmail = async (req, res) => {
    const { email } = req.body;

    const token = crypto.randomBytes(20).toString('hex');

    const expirationDate = new Date(Date.now() + 86400000);

    console.log('Token generado:', token);

 
    const sql = 'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?';
    conexion.query(sql, [token, expirationDate, email], (err, result) => {
        if (err) {
            console.error('Error al actualizar el usuario en la base de datos:', err);
            return res.status(500).send('Error interno del servidor');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('El correo electrónico proporcionado no está registrado');
        }

        const resetUrl = `http://localhost:3000/resetPassword/${token}`;
        console.log(token);
        transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: 'Restablecimiento de contraseña',
            text: `Has solicitado un restablecimiento de contraseña. Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`
        }, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo electrónico:', error);
                return res.status(500).send('Error al enviar el correo electrónico');
            }
            res.redirect('/login');
        });
    });
};

const resetPassword = async (req, res) => {
    const { contrasena, token } = req.body;
    console.log('Token recibido en el body:', token);

    if (!token) {
        return res.status(400).send('El token de restablecimiento de contraseña no es válido');
    }

    const sql = 'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?';
    conexion.query(sql, [token, new Date()], async (err, results) => {
        if (err) {
            console.error('Error al buscar el token en la base de datos:', err);
            return res.status(500).send('Error interno del servidor');
        }

        if (results.length === 0) {
            return res.status(400).send('El token de restablecimiento de contraseña es inválido o ha expirado');
        }

        const usuario = results[0];
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        console.log(usuario);
        console.log('Token recuperado de la base de datos:', usuario.resetPasswordToken);

        const updateSql = 'UPDATE users SET contrasena = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE email = ?';
        conexion.query(updateSql, [hashedPassword, usuario.email], (err, result) => {
            if (err) {
                console.error('Error al actualizar la contraseña en la base de datos:', err);
                return res.status(500).send('Error interno del servidor');
            }

            res.send('Contraseña actualizada con éxito');
        });
    });
};

module.exports = { sendResetEmail, resetPassword };




module.exports = { sendResetEmail, resetPassword };

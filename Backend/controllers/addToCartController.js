const conexion = require('../services/db');

const addToCart = (req, res) => {
    const userId = req.session.user.id;
    const { appid, quantity, price } = req.body;
    const sql = 'INSERT INTO carts (user_id, appid, quantity) VALUES (?, ?, ?)';
    conexion.query(sql, [userId, appid, quantity], (err, result) => {
        if (err) {
            console.log('Error al agregar producto al carrito:', err);
            return res.status(500).send('Error al agregar producto al carrito');
        }
        console.log('Producto agregado al carrito');
        res.json({ message: 'Producto agregado al carrito' });
    });
};


const getCart = (req, res) => {
    console.log('Recibida solicitud para obtener el historial de compras');
    const userId = req.session.user.id; // Suponiendo que tienes un campo 'id' en el objeto de sesión del usuario
    const sql = 'SELECT * FROM carts WHERE user_id = ?';
    conexion.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error al obtener el carrito del usuario:', err);
            return res.status(500).send('Error al obtener el carrito del usuario');
        }
        res.json(results);
    });
};

const removeFromCart = (req, res) => {
    const userId = req.session.user.id;
    const { appid } = req.body;
    const sql = 'DELETE FROM carts WHERE user_id = ? AND appid = ? LIMIT 1';
    conexion.query(sql, [userId, appid], (err, result) => {
        if (err) {
            console.log('Error al eliminar el producto del carrito:', err);
            return res.status(500).send('Error al eliminar el producto del carrito');
        }
        console.log('Producto eliminado del carrito');
        res.json({ message: 'Producto eliminado del carrito' });
    });
};

const clearCart = (req, res) => {
    const userId = req.session.user.id;
    const sql = 'DELETE FROM carts WHERE user_id = ?';
    conexion.query(sql, [userId], (err, result) => {
        if (err) {
            console.log('Error al limpiar el carrito:', err);
            return res.status(500).send('Error al limpiar el carrito');
        }
        console.log('Carrito limpiado');
        res.json({ message: 'Carrito limpiado' });
    });
};

const purchaseItems = (req, res) => {
    const userId = req.session.user.id;
    const sql = 'SELECT * FROM carts WHERE user_id = ?';
    conexion.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error al obtener el carrito del usuario:', err);
            return res.status(500).send('Error al obtener el carrito del usuario');
        }

        const itemsToInsert = {};
        results.forEach(cartItem => {
        
        if (!itemsToInsert[cartItem.appid]) {
            itemsToInsert[cartItem.appid] = {
                appid: cartItem.appid,
                quantity: cartItem.quantity,
              
            };
        } else {
            itemsToInsert[cartItem.appid].quantity += cartItem.quantity;
        }
        });


        const insertSql = 'INSERT INTO purchase_history (user_id, appid, purchase_date, quantity) VALUES (?, ?, ?, ?)';
        Object.values(itemsToInsert).forEach(item => {
            
            conexion.query(insertSql, [userId, item.appid, new Date(), item.quantity], (err, result) => {
                if (err) {
                    console.log('Error al guardar el ítem en purchase_history:', err);
                }
            });
           
        });

        const deleteSql = 'DELETE FROM carts WHERE user_id = ?';
        conexion.query(deleteSql, [userId], (err, result) => {
            if (err) {
                console.log('Error al limpiar el carrito después de la compra:', err);
                return res.status(500).send('Error al limpiar el carrito después de la compra');
            }
            console.log('Carrito limpiado después de la compra');
            res.json({ message: 'Compra realizada exitosamente' });
        });
    });
};

const getHistory = (req, res) => {
    console.log('Recibida solicitud para obtener el historial de compras');
    const userId = req.session.user.id;
    const sql = 'SELECT * FROM purchase_history WHERE user_id = ?';
    conexion.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error al obtener el historial de compras:', err);
            return res.status(500).send('Error al obtener el historial de compras');
        }
        console.log('Historial de compras obtenido:', results);
        res.json(results);
    });
};



module.exports = { addToCart, getCart, getHistory, removeFromCart, clearCart, purchaseItems };
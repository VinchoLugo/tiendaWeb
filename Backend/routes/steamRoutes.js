// Backend/routes/steamRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:gameid', async (req, res) => {
const gameid = req.params.gameid;
try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameid}&l=spanish`);
    res.json(response.data);
} catch (error) {
    console.error('Error al obtener los datos de Steam:', error);
    res.status(500).json({ error: 'Error al obtener los datos de Steam' });
}
});

module.exports = router;

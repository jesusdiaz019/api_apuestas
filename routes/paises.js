const express = require('express');
const router = express.Router();
const Paises = require('../models/Paises');

router.get('/list', async (req, res) =>{
    try {
        const paises = await Paises.find();
        res.json(paises);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
var unirest = require("unirest");
const express = require('express');
const router = express.Router();
const CasasApuestas = require('../models/Casasapuestas');

const {API_FOOTBALL_BOOKMAKERS, API_KEY, API_HOST} = process.env;

router.get('/list/:id', async (req, res) =>{
    try {
        var id = req.params.id;
        
        const casasapuestas = await CasasApuestas.findById(id);
        if(casasapuestas != null || casasapuestas != 0){
            res.json({"message": "NO EXISTE ESTA CASA DE APUESTAS", "value": 300});
        }else{
            res.json(casasapuestas);
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/list', async (req, res) =>{
    try {
        
        const casasapuestas = await CasasApuestas.find();
        if(casasapuestas == null || casasapuestas == 0){
            res.json({"message": "NO EXISTEN CASAS DE APUESTAS", "value": 300});
        }else{
            res.json(casasapuestas);
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/save', async (req, res) => {

    try {
        var api_req = unirest("GET", API_FOOTBALL_BOOKMAKERS);

        api_req.headers({
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": API_HOST,
            "useQueryString": true
        });

        api_req.end(function (api_res) {
        if (api_res.error){
            res.json(api_res.error);
        }else if(api_res.body.response != 0){
            var data = api_res.body.response;
            for(var i=0; i<data.length ;i++){
                (async () => {
                    try {
                        const casasapuestas = new CasasApuestas({
                            _id: data[i].id,
                            name: data[i].name,
                        });
                        const result = await CasasApuestas.findById(data[i].id);
                        if(result == null || result == 0){
                            const save = await casasapuestas.save();
                            console.log(save);
                        };
                    } catch (error) {
                        console.log(error+"xd");
                    }
                })(); 
            }
            res.json({"message": "SE HA GUARDADO CON ÉXITO", "value": 202});
            
        }else{
            res.json({"message": "NO EXISTEN CASAS DE APUESTAS", "value": 300});
        }
        });
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;
var unirest = require("unirest");
const express = require('express');
const router = express.Router();
const Equipos = require('../models/Equipos');
const moment = require('moment-timezone');

const {API_FOOTBALL_TEAMS, API_KEY, API_HOST} = process.env;
//GET ALL THE POST


router.get('/list/:id', async (req, res) =>{
    try {
        var id = req.params.id;
        const equipos = await Equipos.find({ _id: id });
        res.json(equipos);
    } catch (error) {
        console.log(error);
    }
});

router.get('/save', async (req, res) => {

    try {
        var api_req = unirest("GET", API_FOOTBALL_TEAMS);
        var pais = req.query.pais;

        api_req.query({
            "country": pais
        });
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
            var message = [];
            for(var i=0; i<data.length ;i++){
                try {
                    const equipos = new Equipos({
                        _id: data[i].team.id,
                        name: data[i].team.name,
                        pais: data[i].team.country,
                        fundado: data[i].team.founded,
                        logo: data[i].team.logo,
                        nacional: data[i].team.national
                    });
                    const result = Equipos.findById(data[i].team.id);

                    if(result == null || result == 0){
                        const save =  equipos.save();
                        message.push({"message": "SE HA GUARDADO CON EXITO", "value": 202});
                    }else{
                        message.push({"message": "YA EXISTE ESTE EQUIPO", "value": 302});
                    }

                } catch (error) {
                    message.push({"message": "ERROR AL GUARDAR O MODIFICAR UN EQUIPO", "value": 304});
                }
            }
            res.json(message);
            
        }else{
            res.json({"message": "NO HAY PARTIDOS ACTIVAS DE "+pais, "value": 300});
        }
        });
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;
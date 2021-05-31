var unirest = require("unirest");
const express = require('express');
const router = express.Router();
const Paisliga = require('../models/Paisliga');

const {API_FOOTBALL_LEAGUE, API_KEY, API_HOST} = process.env;
//GET ALL THE POST

router.get('/list', async (req, res) =>{
    try {
        const paisliga = await Paisliga.aggregate([

            { $unwind: '$ligas' },

            { $sort: {
                pais: 1,
                'ligas._id': 1
            }},
            {$group: {_id: '$_id', 'pais': {$first: '$pais'},'ligas': {
                $push: '$ligas'
            }}},
        ]);
        res.json(paisliga);
    } catch (error) {
        console.log(error);
    }
});

router.post('/save', async (req, res) => {

    try {
        var api_req = unirest("GET", API_FOOTBALL_LEAGUE);
        var pais = req.body.pais;
        var temporada = req.body.temporada;
        var estado = req.body.estado;

        api_req.query({
            "country": pais,
            "season": temporada,
            "current": estado
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
            var list = [];
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            for(var i=0; i<data.length ;i++){
                if(today<=data[i].seasons[0].end){
                    list.push({
                        _id: data[i].league.id,
                        liga: data[i].league.name,
                        tipo_liga: data[i].league.type,
                        logo: data[i].league.logo,
                        fecha_inicio: data[i].seasons[0].start,
                        fecha_fin: data[i].seasons[0].end,
                        estado: data[i].seasons[0].current
                    });   
                }            
            }
            (async () => {
            try {
                const paisliga = new Paisliga({
                    pais: data[0].country.name,
                    ligas: list,
                });
                const result = await Paisliga.updateOne({
                    pais: data[0].country.name
                },
                {
                    ligas: paisliga.ligas
                });
                console.log(result);
                if(result.n == 0){
                    if(list != 0 || list != null){
                        const save = paisliga.save();
                        res.json([{"message": "SE HA GUARDADO CON ÉXITO", "value": 202}]);
                    }else{
                        res.json([{"message": "NO HAY LIGAS ACTIVAS DE "+pais, "value": 300}]);
                    }
                }else if(result.nModified == 0){
                    res.json([{"message": "NO HUBO CAMBIOS AL MODIFICAR", "value": 200}]);
                    
                }else{
                    res.json([{"message": "SE HA MODIFICADO CON ÉXITO", "value": 204}]);
                }
            } catch (error) {
                res.json([{"message": "ERROR INTERNO DE LA API", "value": 302}]);
            }
        })();
        }else{
            res.json([{"message": "NO HAY LIGAS ACTIVAS DE "+pais, "value": 300}]);
        }
        
        });
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;
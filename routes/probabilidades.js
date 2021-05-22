var unirest = require("unirest");
const express = require('express');
const router = express.Router();
const Probabilidades = require('../models/Probabilidades');

const {API_FOOTBALL_ODDS, API_KEY, API_HOST} = process.env;

router.get('/list/:id', async (req, res) =>{
    try {
        var id = req.params.id;
        
        const probabilidades = await Probabilidades.findById(id);
        if(probabilidades != null || probabilidades != 0){
            res.json({"message": "NO EXISTE ESTA CASA DE APUESTAS", "value": 300});
        }else{
            res.json(probabilidades);
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/list', async (req, res) =>{
    try {
        
        const probabilidades = await Probabilidades.find();
        if(probabilidades == null || probabilidades == 0){
            res.json({"message": "NO EXISTEN CASAS DE APUESTAS", "value": 300});
        }else{
            res.json(probabilidades);
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/save', async (req, res) => {

    try {
        var api_req = unirest("GET", API_FOOTBALL_ODDS);
        var liga = req.query.liga;
        var temporada = req.query.temporada;
        var casaapuestas = req.query.casaapuestas;
        var pagina = req.query.pagina;

        api_req.query({
            "league": liga,
            "bookmaker": casaapuestas,
            "season": temporada,
            "page": pagina
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
            for(var i=0; i<data.length ;i++){
                var data_casaapuestas = data[i].bookmakers;
                var casaapuestas = [];
                for(var j=0; j<data_casaapuestas.length; j++){
                    var data_apuestas = data[i].bookmakers[0].bets;
                    var apuestas = [];
                    for(var k=0; k<data_apuestas.length; k++){
                        var data_valores = data_apuestas[j].values;
                        var valores = [];
                        for(var l=0; l<data_valores.length; l++){
                            valores.push({
                                valor: data_valores[l].value,
                                probabilidad: data_valores[l].odd,
                            });
                        };
                        apuestas.push({
                            _id: data_apuestas[k].id,
                            nombre: data_apuestas[k].name,
                            valores: valores,
                        });
                    };
                };
                (async () => {
                    try {
                        const probabilidades = new Probabilidades({
                            _id: data[i].fixture.id,
                            casasapuestas: [{
                                _id: data[i].bookmakers[0].id,
                                nombre: data[i].bookmakers[0].name,
                                apuestas: apuestas
                            }]
                        });
                        
                        const result = await Probabilidades.updateOne({
                            _id: data[i].fixture.id
                        },
                        {
                            casasapuestas: {
                                apuestas: apuestas
                            }
                        });
                        if(result.n == 0){
                            const save = await probabilidades.save();
                        };
                    } catch (error) {
                        console.log(error+"xd");
                    }
                })();
            }
            res.json({"message": "SE HA GUARDADO O MODIFICADO CON ÉXITO", "value": 202});
            
        }else{
            res.json({"message": "NO EXISTEN PROBABILIDADES", "value": 300});
        }
        });
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;
var unirest = require("unirest");
const express = require('express');
const router = express.Router();
const Fixture = require('../models/Fixture');
const moment = require('moment-timezone');

const {API_FOOTBALL_FIXTURE, API_KEY, API_HOST} = process.env;
//GET ALL THE POST


router.get('/example', async (req, res)=>{
    try {
        var date = moment.utc('2021-05-21T18:15:00+00:00').tz('America/Lima').format();
        var fecha = moment.tz('America/Lima').format('YYYY');
        var fecha_int = parseInt(fecha)+1;
        res.send(date);
    } catch (error) {
        console.log(error);
    }
});

router.get('/list/:id', async (req, res) =>{
    try {
        var id = req.params.id;
        const fixture = await Fixture.aggregate([
            {$match: { liga: id}},

            {$lookup: {
                from: "equipos",
                localField: "equipos.local._id",
                foreignField: "_id",
                as: "equipolocal"

            }},
            {$lookup: {
                from: "equipos",
                localField: "equipos.visitante._id",
                foreignField: "_id",
                as: "equipovisitante"

            }},
            {$project: {
                _id: 1,
                liga_id: "$liga",
                fecha: "$fecha",
                lugar: "$lugar",
                estadio: "$estadio",
                equipos: {
                    local: "$equipolocal",
                    visitante: "$equipovisitante"
                },
                score: "$score",
                estado: "$estado"
            }},
            {$sort: {
                fecha: 1
            }}
        ]);
        res.json(fixture);
    } catch (error) {
        console.log(error);
    }
});

router.get('/save', async (req, res) => {

    try {
        var api_req = unirest("GET", API_FOOTBALL_FIXTURE);
        var liga = req.query.liga;
        var temporada = req.query.temporada;
        var fecha = moment.tz('America/Lima');
        var fecha_int = parseInt(fecha.format('YYYY'))+1;

        api_req.query({
            "league": liga,
            "from": fecha.format('YYYY-MM-DD'),
            "to": fecha_int.toString()+'-01-01',
            "season": temporada
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
                (async () => {
                    try {
                        var date = moment.utc(data[i].fixture.date).tz('America/Lima').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                        const fixture = new Fixture({
                            _id: data[i].fixture.id,
                            liga: data[i].league.id,
                            fecha: date,
                            lugar: data[i].fixture.venue.city,
                            estadio: data[i].fixture.venue.name,
                            equipos: {
                                local: {
                                    _id: data[i].teams.home.id,
                                    ganador: data[i].teams.home.winner
                                },
                                visitante:{
                                    _id: data[i].teams.away.id,
                                    ganador: data[i].teams.away.winner
                                }
                            },
                            goles: {
                                local: data[i].goals.home,
                                visitante: data[i].goals.away
                            },
                            score: {
                                mediotiempo: {
                                    local: data[i].score.halftime.home,
                                    visitante: data[i].score.halftime.away
                                },
                                tiempocompleto: {
                                    local: data[i].score.fulltime.home,
                                    visitante: data[i].score.fulltime.away,
                                },
                                tiempoextra: {
                                    local: data[i].score.extratime.home,
                                    visitante: data[i].score.extratime.away,
                                },
                                penales: {
                                    local: data[i].score.penalty.home,
                                    visitante: data[i].score.penalty.away,
                                }
                            },
                            estado: {
                                long: data[i].fixture.status.long,  
                                short: data[i].fixture.status.short,
                                tiempo: data[i].fixture.status.elapsed,       
                            }, 
                        });
                        const result = await Fixture.updateOne({
                            _id: data[i].fixture.id
                        },
                        {
                            equipos: fixture.equipos,
                            score: fixture.score,
                            estado: fixture.estado

                        });
                        if(result.n == 0){
                            const save = await fixture.save();
                        };
                    } catch (error) {
                        console.log(error+"xd");
                    }
                })(); 
            }
            res.json({"message": "SE HA GUARDADO O MODIFICADO CON ÉXITO", "value": 202});
            
        }else{
            res.json({"message": "NO HAY PARTIDOS ACTIVAS DE "+pais, "value": 300});
        }
        });
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;
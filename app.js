const express = require('express');
var http = require("http");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const port = process.env.PORT || 3000;
var server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
});

//app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req,res) => {
    res.send('hello world!');
});

const paisligaRoute = require('./routes/paisligas');
const fixtureRoute = require('./routes/fixture');
const equiposRoute = require('./routes/equipos');
const casasapuestasRoute = require('./routes/casasapuestas');
const probabilidadesRoute = require('./routes/probabilidades');
const paisesRoute = require('./routes/paises');

app.use('/paisliga', paisligaRoute);
app.use('/fixture', fixtureRoute);
app.use('/equipos', equiposRoute);
app.use('/casasapuestas', casasapuestasRoute);
app.use('/probabilidades', probabilidadesRoute);
app.use('/paises', paisesRoute);

mongoose.connect(
    process.env.DB_CONNECTION, 
    {useNewUrlParser: true, useUnifiedTopology: true}
)
    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log(e))

io.on('connection', (socket) => {
    console.log('new connection');
    console.log(socket.id, "has joined");
    socket.on("/test",(msg)=>{
        console.log(msg);
    })
});

server.listen(port,() =>{
    console.log(`Server on port `+port)
});
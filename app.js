const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req,res) => {
    res.send('hello world!');
});


const paisligaRoute = require('./routes/paisligas');

app.use('/paisliga', paisligaRoute);

mongoose.connect(
    process.env.DB_CONNECTION, 
    {useNewUrlParser: true, useUnifiedTopology: true}
)
    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log(e))

app.listen(app.get('port'),() =>{
    console.log(`Server on port ${app.get('port')}`)
});   
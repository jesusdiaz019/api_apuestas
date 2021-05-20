const mongoose = require('mongoose');

const EquiposSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pais: {
        type: String,
        required: true
    },
    fundado: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    nacional: {
        type: Boolean,
        required: true
    }
    
});

module.exports = mongoose.model('Equipos', EquiposSchema);
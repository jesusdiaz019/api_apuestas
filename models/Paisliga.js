const mongoose = require('mongoose');

const PaisligaSchema = mongoose.Schema({
    pais: {
        type: String,
        required: true
    },
    ligas: [{
        _id: {
            type: String,
            required: true
        },
        liga: {
            type: String,
            required: true
        },
        tipo_liga: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            required: true
        },
        fecha_inicio: {
            type: Date,
            required: true
        },
        fecha_fin: {
            type: Date,
            required: true
        },
        estado: {
            type: Boolean,
            required: true
        },
    }]
});

module.exports = mongoose.model('Paisliga', PaisligaSchema);
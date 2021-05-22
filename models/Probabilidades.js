const mongoose = require('mongoose');

const ProbabilidadesSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    casasapuestas: [{
        _id: {
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        apuestas: [{
            _id: {
                type: String,
                required: true
            },
            nombre: {
                type: String,
                required: true
            },
            valores: [{
                valor: {
                    type: String,
                    required: true
                },
                probabilidad: {
                    type: String,
                    required: true
                }
            }]
        }]
    }]
});

module.exports = mongoose.model('Probabilidades', ProbabilidadesSchema);
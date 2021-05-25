const mongoose = require('mongoose');

const PaisesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    codigo_postal: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        required: true
    }
    
});

module.exports = mongoose.model('Paises', PaisesSchema);
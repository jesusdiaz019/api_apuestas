const mongoose = require('mongoose');

const CasasApuestasSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('CasasApuestas', CasasApuestasSchema);
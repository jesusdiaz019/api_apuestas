const mongoose = require('mongoose');

const FixtureSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    liga: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    lugar: {
        type: String,
        required: true
    },
    estadio: {
        type: String,
        required: true
    },
    equipos: {
        local: {
            _id: {
                type: String,
                required: true
            },
            ganador: {
                type: String,
                required: false
            },
        },
        visitante: {
            _id: {
                type: String,
                required: true
            },
            ganador: {
                type: String,
                required: false
            },
        },
    },
    goles: {
        local: {
            _id: {
                type: String,
                required: false
            },
            ganador: {
                type: String,
                required: false
            },
        },
        visitante: {
            _id: {
                type: String,
                required: false
            },
            ganador: {
                type: String,
                required: false
            },
        },
    },
    score: {
        mediotiempo: {
            local: {
                type: String,
                required: false
            },
            visitante: {
                type: String,
                required: false
            },
        },
        tiempocompleto: {
            local: {
                type: String,
                required: false
            },
            visitante: {
                type: String,
                required: false
            },
        },
        tiempoextra: {
            local: {
                type: String,
                required: false
            },
            visitante: {
                type: String,
                required: false
            },
        },
        penales: {
            local: {
                type: String,
                required: false
            },
            visitante: {
                type: String,
                required: false
            },
        }
    },
    estado: {
        long: {
            type: String,
            required: false
        },
        short: {
            type: String,
            required: false
        },
        tiempo: {
            type: String,
            required: false
        },
    }
});

module.exports = mongoose.model('Fixture', FixtureSchema);
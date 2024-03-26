const { Schema, model } = require('mongoose');

const TemaSchema = Schema({
    asunto: {
        type: String,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    adjunto: {
        type: String
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
},
{
    timestamps: true
});

TemaSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Tema', TemaSchema);
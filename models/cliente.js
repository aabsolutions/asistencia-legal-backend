const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({

    cedula: {
        type: String,
        required: true,
        unique: true
    },
    nombre_completo: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    tipo_cliente: {
        type: String,
        enum: ['NATURAL', 'JURIDICO'],
        required: true
    },
    img: {
        type: String,
    },  
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

ClienteSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Cliente', ClienteSchema);
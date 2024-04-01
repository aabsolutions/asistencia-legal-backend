const { Schema, model } = require('mongoose');

const SubtemaSchema = Schema({
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
    img_public_id: {
        type: String,
    },  
    img_secure_url: {
        type: String,
    },  
    tema: {
        type: Schema.Types.ObjectId,
        ref: 'Tema'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
},
{
    timestamps: true
});

SubtemaSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Subtema', SubtemaSchema);
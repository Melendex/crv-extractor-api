const mongoose = require('mongoose')

const paisSchema = new mongoose.Schema({
    etiqueta: {
        type: String,
        required: true,
        trim: true
    },
    codigo: {
        type: String,
        trim: true,
        required: true
    },
    abreviatura: {
        type: String,
        required: true,
        trim: true
    },
    eliminar: {
        type: String,
        required: false,
        trim: true
    },
    creado_por: {
        type: String,
        required: false,
        trim: true
    },
    fecha_registro: {
        type: String,
        required: false,
        trim: true
    },
    modificado_por: {
        type: String,
        required: false,
        trim: true
    },
    fecha_revision: {
        type: String,
        required: false,
        trim: true
    },
    codigo_inegi: {
        type: String,
        required: false,
        trim: true
    },
    paraiso_fiscal: {
        type: String,
        required: false,
        trim: true
    }

}, { timestamps: true })

paisSchema.methods.toJSON = function() {
    const user = this

    const userPublic = user.toObject()

    delete userPublic._id;
    delete userPublic.__v

    return userPublic
}


const Pais = mongoose.model('Pais', paisSchema)

module.exports = Pais
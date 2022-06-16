const mongoose = require('mongoose');

const catalogoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    data: []
})


const Catalogo = mongoose.model('Catalogos', catalogoSchema);

module.exports = Catalogo;
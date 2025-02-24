const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true, match: /^[A-Za-z\s]+$/ },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('Book', bookSchema);
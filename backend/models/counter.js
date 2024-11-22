const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
	key: { type: String, required: true, unique: true }, // Identifier for the counter
	count: { type: Number, default: 0 }, // Current counter value
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;

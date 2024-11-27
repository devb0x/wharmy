const mongoose = require('mongoose');

// Define the schema for paints used in steps
const paintSchema = new mongoose.Schema({
	type: String,
	brand: String,
	name: String
});

// Define the schema for a single step
const stepSchema = new mongoose.Schema({
	number: { type: Number, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	paintsUsed: [paintSchema],
	pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }]
});

// Define the schema for a single miniature
const miniatureSchema = new mongoose.Schema({
	name: { type: String, required: true },
	ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	armyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Army', required: true },
	thumbnailUrl: { type: String, default: '' },
	steps: [stepSchema]
}, { timestamps: true });

module.exports = mongoose.model('Miniature', miniatureSchema);

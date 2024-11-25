const mongoose = require('mongoose')

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
	ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	armyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Army', required: true },
	name: { type: String, required: true },
	thumbnailUrl: { type: String, default: '' },
	steps: [stepSchema]
});

const armySchema = mongoose.Schema({
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	subCategory: {
		type: String,
		required: true
	},
	pictures: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Picture'
	}],
	miniatures: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Miniature'
	}],
	thumbnailUrl: {
		type: String,
		default: ''
	},
	description: {
		type: String,
		default: ''
	},
	lore: {
		type: String,
		default: ''
	}
}, { timestamps: true })

module.exports = mongoose.model("Army", armySchema)
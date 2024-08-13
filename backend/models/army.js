const mongoose = require('mongoose')

// Define the schema for a single step
const stepSchema = new mongoose.Schema({
	number: { type: Number, required: true },
	value: { type: String, required: true },
	pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }]
});

// Define the schema for a single miniature
const miniatureSchema = new mongoose.Schema({
	ownerId: { type: String, required: true },
	armyId: { type: String, required: true },
	name: { type: String, required: true },
	steps: [stepSchema]
});

const armySchema = mongoose.Schema({
	ownerId: {
		type: String,
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
	miniatures: [
		miniatureSchema
	],
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
const mongoose = require('mongoose')

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
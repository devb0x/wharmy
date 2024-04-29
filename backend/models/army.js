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
	miniatures: {
		type: [],
	}
})

module.exports = mongoose.model("Army", armySchema)
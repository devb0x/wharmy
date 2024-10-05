const mongoose = require('mongoose')

const pictureSchema = new mongoose.Schema({
	ownerId: {
		type: String,
		required: true
	},
	armyId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	miniatureId: {
		type: mongoose.Schema.Types.ObjectId,
		required: false
	},
	fileName: {
		type: String,
		required: true
	},
	fileUrl: {
		type: String,
		required: true
	},
	uploadDate: {
		type: Date,
		required: true
	}
})

// Create a unique index on the combination of ownerId, armyId, and fileName
pictureSchema.index(
	{ ownerId: 1, armyId: 1, fileName: 1 },
	{ unique: true }
)

// Add a separate index for querying by armyId
pictureSchema.index(
	{ armyId: 1 }
)

module.exports = mongoose.model("Picture", pictureSchema)
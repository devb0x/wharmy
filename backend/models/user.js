const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password : {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	isVerified: {
		type: Boolean, default: false
	},
	memberNumber: {
		type: String,
		unique: true,
		required: true
	},
	verificationToken: String,
	verificationExpires: Date,
	resetPasswordToken: String,
	resetExpires: Date
})
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)
const bcrypt = require('bcrypt')
const User = require('../models/user')

exports.createUser = (req, res, next) => {
	console.log(req.body)
	bcrypt.hash(req.body.password, 10)
		.then(hash => {
			const user = new User({
				email: req.body.email,
				password: hash
			})
			user.save()
				.then(result => {
					res.status(201).json({
						message: 'New User created',
						result: result
					})
				})
				.catch(err => {
					res.status(500).json({
						message: 'Invalid credentials'
					})
				})
		})
}

exports.getUsers = (req, res, next) => {
	const posts = [
		{
			title: "ok",
			description: "azae"
		}
	]
	res.json({
		message: "posts fetched",
		posts: posts
	})
}
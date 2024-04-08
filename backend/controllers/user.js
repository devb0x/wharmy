const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.createUser = (req, res, next) => {
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

exports.checkUserExists = async (req, res) => {
	try {
		const { email } = req.query; // Extract email parameter from query string

		// Check if a user with the provided email exists in the database
		const user = await User.findOne({ email });

		if (user) {
			// User with the provided email exists
			res.status(200).json({ exists: true, user });
		} else {
			// User with the provided email does not exist
			res.status(200).json({ exists: false });
		}
	} catch (error) {
		// Handle any errors
		console.error('Error checking user existence:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

exports.loginUser = (req, res, next) => {
	let fetchedUser
	User
		.findOne({ email: req.body.email })
		.then(user => {
			if (!user) {
				return res.status(401).json({
					message: "Login failed"
				})
			}
			fetchedUser = user
			return bcrypt.compare(req.body.password, user.password)
		})
		.then(result => {
			if (!result) {
				return res.status(401).json({
					message: "Login failed"
				})
			}
			const token = jwt.sign(
				{ email: fetchedUser.email, userId: fetchedUser._id },
				process.env.JWT_KEY,
				{ expiresIn: "1h"}
			)
			res.status(201).json({
				token: token,
				expiresIn: 3600,
				userId: fetchedUser._id
			})
		})
		.catch(err => {
			return res.status(401).json({
				message: "Invalid Authentication Credentials"
			})
		})
}

exports.getUserInformation = async (req, res, next) => {
	try {
		const { id } = req.query
		const user = await User.findOne({ _id: id })

		if (user) {
			// User with the provided email exists
			console.log(user)
			res.status(200).json({ exists: true, user });
		} else {
			// User with the provided email does not exist
			res.status(200).json({ exists: false });
		}
	} catch (error) {
		// Handle any errors
		console.error('Error checking user existence:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

/**
 * dummy function delete later
 * @param req
 * @param res
 * @param next
 */
exports.getPosts = (req, res, next) => {
	console.log('dummy posts')
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

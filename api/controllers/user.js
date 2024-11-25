const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const crypto = require('crypto')

const User = require('../models/user')

const { getNextSequenceValue } = require("../utils/counterHelper")
const sendVerificationEmail = require("../../src/app/utils/sendVerificationEmail")
const sendResetPasswordEmail = require("../../src/app/utils/sendResetPasswordEmail")

exports.createUser = async (req, res, next) => {
	const verificationToken = crypto.randomBytes(32).toString('hex'); // Generate token
	const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours

	/**
	 * Generate the member Number
	 * @type {*}
	 */
	const memberNumber = await getNextSequenceValue('memberNumber')

	bcrypt.hash(req.body.password, 10)
		.then(hash => {
			const user = new User({
				email: req.body.email,
				username: req.body.username,
				password: hash,
				isVerified: false,
				memberNumber,
				verificationToken,
				verificationExpires
			})
			user.save()
				.then(result => {
					sendVerificationEmail(user.email, verificationToken)
						.catch(err => {
							console.error('Error sending verification email:', err);
						});
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
		console.error('Error checking user existence: ', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

exports.confirmAccount = async (req, res, next) => {
	const { token } = req.params;

	User.findOneAndUpdate(
		{ verificationToken: token, verificationExpires: { $gt: Date.now() } },
		{ $set: { isVerified: true }, $unset: { verificationToken: "", verificationExpires: "" } },
		{ new: true }
	)
		.then(user => {
			if (!user) {
				return res.status(400).json({ message: 'Verification failed or link expired.' });
			}
			res.status(200).json({ message: 'Account verified successfully.' });
		})
		.catch(err => {
			res.status(500).json({ message: 'Internal server error.' });
		});
}

exports.checkUsernameTaken = async (req, res) => {
	try {
		const { username } = req.query

		const user = await User.findOne({ username })

		if (user) {
			res.status(200).json({ taken: true, user })
		} else {
			res.status(200).json({ taken: false })
		}
	} catch (error) {
		console.error('Error checking username taken: ', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

exports.loginUser = async (req, res, next) => {
	User
		.findOne({ email: req.body.email })
		.then(async user => {
			if (!user) {
				return res.status(401).json({
					message: "Login failed"
				})
			}

			const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
			if (!isPasswordCorrect) {
				return res.status(401).json({message: "Incorrect email or password"});
			}

			// Check if the user's account is verified
			// reason used in auth service for redirecting the user
			if (!user.isVerified) {
				// Send a distinct response for unverified accounts
				return res.status(403).json({
					message: "Account not verified. Please verify your account.",
					reason: "unverified",
					action: "verify" // Custom response to guide frontend to verification process
				});
			}

			// If account is verified, check password
			return bcrypt.compare(req.body.password, user.password)
				.then(result => {
					if (!result) {
						return res.status(401).json({
							message: "Login failed"
						})
					}
					const token = jwt.sign(
						{email: user.email, userId: user._id},
						process.env.JWT_KEY,
						{expiresIn: "1h"}
					)
					res.status(201).json({
						token: token,
						expiresIn: 3600,
						userId: user._id
					})
				})
		})
		.catch(err => {
			return res.status(500).json({
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

// exports.searchUsers = async (req, res, next) => {
// 	const query = req.query.query
//
// 	User
// 		.find({ username: { $regex: query, $options: 'i' } })
// 		.then(users => {
// 			res.status(200).json(users)
// 		})
// 		.catch(error => {
// 			res.status(500).json({
// 				message: "Fetching User(s) failed!"
// 			})
// 		})
// }

exports.searchUsers = async (req, res, next) => {
	const query = req.query.query;

	try {
		const users = await User.aggregate([
			{
				$match: { username: { $regex: query, $options: 'i' } },
			},
			{
				$lookup: {
					from: 'armies', // Collection name of armies
					localField: '_id',
					foreignField: 'ownerId',
					as: 'userArmies',
				},
			},
			{
				$lookup: {
					from: 'miniatures', // Collection name of miniatures
					localField: '_id',
					foreignField: 'ownerId',
					as: 'userMiniatures',
				},
			},
			{
				$project: {
					_id: 1,
					username: 1,
					memberNumber: 1,
					armiesCount: { $size: '$userArmies' },
					miniaturesCount: { $size: '$userMiniatures' },
				},
			},
		]);

		if (users.length === 0) {
			return res.status(404).json({ message: 'No users found' });
		}

		res.status(200).json(users);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ message: 'Fetching User(s) failed!' });
	}
};


exports.sendVerificationLink = async (req, res) => {
	const { email } = req.body;

	try {
		// Find the user by email
		const user = await User.findOne({ email });

		// Check if user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the account is already verified
		if (user.isVerified) {
			return res.status(400).json({ message: "Account already verified" });
		}

		// Generate a new verification token and expiration time
		const verificationToken = crypto.randomBytes(32).toString('hex');
		const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours

		// Update user with new verification token and expiration date
		user.verificationToken = verificationToken;
		user.verificationExpires = verificationExpires;
		await user.save();

		// Send the verification email
		await sendVerificationEmail(user.email, verificationToken);
		res.status(200).json({ message: 'Verification link sent' });

	} catch (error) {
		res.status(500).json({ message: 'Error sending verification link', error: error.message });
	}
};

exports.sendRetrievePasswordLink = async (req, res) => {
	const email = req.body.email;

	try {
		// Find the user by email
		const user = await User.findOne({ email });

		if (user) {
			// Generate a new verification token and expiration time
			const resetPasswordToken = crypto.randomBytes(32).toString('hex');
			const resetExpires = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours

			// Update user with new verification token and expiration date
			user.resetPasswordToken = resetPasswordToken;
			user.resetExpires = resetExpires;

			await user.save();

			// Send the verification email
			await sendResetPasswordEmail(user.email, resetPasswordToken);
		}

		// Send a unified success response whether the user exists
		res.status(200).json({ message: 'If an account with this email exists, a reset link has been sent.' });

	} catch (error) {
		res.status(500).json({ message: 'Error processing request' });
	}
}

exports.updatePassword = async (req, res) => {
	const resetPasswordToken = req.body.token
	const newPassword = req.body.password

	try {
		const user = await User.findOne({ resetPasswordToken })

		if (!user) {
			return res.status(200).json({ message: 'Password reset successfully' })
		}

		if (user.resetExpires < Date.now()) {
			return res.status(401).json({ message: 'Token expired '})
		}

		// Hash the new password
		const hash = await bcrypt.hash(newPassword, 10)

		// Update the user document with new password and clear token/expiration
		await user.updateOne({
			password: hash,
			$unset: { resetPasswordToken: '', resetExpires: ''}
		});

		return res.status(200).json({
			message: 'User password updated'
		});
	} catch (error) {
		console.error('Error updating password:', error)
		res.status(500).json({ message: 'Error updating the User document' })
	}
}

exports.getUserId = async (req, res, next) => {
	const { number } = req.params; // Retrieve the member number from the route

	try {
		// Query the User model to find the user by their memberNumber
		const user = await User.findOne({ memberNumber: number });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });  // Return a 404 if the user is not found
		}

		// If the user is found, return the userId
		res.status(200).json({ userId: user._id });  // Return the user's _id (or any other field you need)
	} catch (error) {
		console.error('Error fetching user:', error);
		return res.status(500).json({ message: 'Server error' });  // Return 500 on server error
	}
};

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

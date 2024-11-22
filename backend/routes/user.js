const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const UserController = require('../controllers/user')

router.post(
	"/signup",
	UserController.createUser
)

router.post(
	'/login',
	UserController.loginUser
)

router.get(
	'/userExist',
	UserController.checkUserExists
)

router.get(
	'/confirmAccount/:token',
	UserController.confirmAccount
)

router.post(
	'/resend-verification',
	UserController.sendVerificationLink
)

router.post(
	'/sendRetrievePasswordLink',
	UserController.sendRetrievePasswordLink
)

router.put(
	'/updateUserPassword',
	UserController.updatePassword
)

router.get(
	'/usernameTaken',
	UserController.checkUsernameTaken
)

router.get(
	'/getUserInformation',
	checkAuth,
	UserController.getUserInformation
)

router.get(
	'/search-users',
	UserController.searchUsers
)

router.get(
	'/getUserId/:number',
	UserController.getUserId
)

router.get(
	'/dummy',
	UserController.getPosts
)

module.exports = router
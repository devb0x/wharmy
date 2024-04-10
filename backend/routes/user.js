const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const UserController = require('../controllers/user')

router.post(
	"/signup",
	UserController.createUser
)

router.get(
	'/userExist',
	UserController.checkUserExists
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

router.post(
	'/login',
	UserController.loginUser
)

router.get(
	'/dummy',
	UserController.getPosts
)

module.exports = router
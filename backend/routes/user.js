const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')

router.post("/signup", UserController.createUser)
router.get('/userExist', UserController.checkUserExists)

router.get('/dummy', UserController.getPosts)

module.exports = router
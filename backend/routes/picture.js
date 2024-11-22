const express = require('express')
const router = express.Router()

const PictureController = require('../controllers/picture')

router.get(
	'/recent-uploads',
	PictureController.getRecentMiniatures
)

module.exports = router
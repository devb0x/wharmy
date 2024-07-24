const express = require('express')
const router = express.Router()

const MiniatureController = require('../controllers/miniature')

router.get(
	'/recent-uploads',
	MiniatureController.getRecentMiniatures
)

module.exports = router
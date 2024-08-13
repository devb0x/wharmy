const express = require('express')
const router = express.Router()

const MiniatureController = require('../controllers/miniature')

router.get(
	"/:armyId/miniature/:miniatureId",
	MiniatureController.getMiniature
)

module.exports = router
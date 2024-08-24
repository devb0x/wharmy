const express = require('express')
const router = express.Router()

const MiniatureController = require('../controllers/miniature')

router.get(
	"/:armyId/miniature/:miniatureId",
	MiniatureController.getMiniature
)

router.post(
	"/:armyId/miniature/edit/:miniatureId",
	MiniatureController.addStepToMiniature
)

router.put(
	"/:armyId/miniature/edit/:miniatureId/edit-step/:stepNumber",
	MiniatureController.editStepToMiniature
)

module.exports = router
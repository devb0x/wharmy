const express = require('express')
const router = express.Router()

const MiniatureController = require('../controllers/miniature')

router.get(
	"/:armyId/miniature/:miniatureId",
	MiniatureController.getMiniature
)

router.get(
	"/miniature/search-miniatures",
	MiniatureController.searchMiniatures
)

router.post(
	"/:armyId/miniature/edit/:miniatureId",
	MiniatureController.addStepToMiniature
)

router.put(
	"/:armyId/miniature/edit/:miniatureId/edit-step/:stepNumber",
	MiniatureController.editStepToMiniature
)

router.put(
	"/:armyId/miniature/update-thumbnail/:miniatureId",
	MiniatureController.updateThumbnail
)

module.exports = router
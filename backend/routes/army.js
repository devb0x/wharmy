const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const ArmyController = require('../controllers/army')

router.post(
	"/new-army",
	checkAuth,
	ArmyController.createNewArmy
)

router.get(
	"/armies",
	checkAuth,
	ArmyController.getUserArmies
)

router.get(
	"/:id",
	ArmyController.getArmy
)

router.put(
	"/edit/:id",
	checkAuth,
	ArmyController.updateArmy
)

router.put(
	"/edit/thumbnail/:id",
	checkAuth,
	ArmyController.updateThumbnail
)

module.exports = router
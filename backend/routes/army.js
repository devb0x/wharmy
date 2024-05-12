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

module.exports = router
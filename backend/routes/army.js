const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const ArmyController = require('../controllers/army')

router.post(
	"/new-army",
	checkAuth,
	ArmyController.createNewArmy
)

/**
 * all armies
 */
router.get(
	"/all",
	ArmyController.getAllArmies
)

/**
 * route for search request
 */
router.get(
	"/search-armies",
	ArmyController.searchArmies
)

/**
 * armies for specific user
 */
router.get(
	"/armies",
	checkAuth,
	ArmyController.getUserArmies
)

router.get(
	"/armies/:memberNumber",
	ArmyController.getUserArmiesByNumber
)

router.get(
	"/:armyId",
	ArmyController.getArmy
)

/**
 * route for editing army
 */
router.put(
	"/edit/:armyId",
	checkAuth,
	ArmyController.updateArmy
)

/**
 * route for delete an army
 */
router.delete(
	"/delete/:armyId",
	checkAuth,
	ArmyController.deleteArmy
)

/**
 * route for delete a miniature
 */
router.delete(
	"/delete/:armyId/miniature/:miniatureId",
	checkAuth,
	ArmyController.deleteMiniature
)

/**
 * route for adding miniature
 */
router.put(
	"/edit/add-miniature/:id",
	checkAuth,
	ArmyController.addMiniatureToTheArmy
)

router.put(
	"/edit/thumbnail/:id",
	checkAuth,
	ArmyController.updateThumbnail
)

module.exports = router
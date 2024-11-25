const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const upload = require("../middleware/multer")

const UploadController = require("../controllers/upload")

router.post(
	"/upload",
	checkAuth,
	upload.array('files'),
	UploadController.upload
)

router.post(
	"/uploadToMiniature",
	checkAuth,
	upload.array('files'),
	UploadController.uploadToMiniature
)

router.delete(
	"/delete/:pictureId",
	checkAuth,
	UploadController.delete
)

router.delete(
	"/deleteFromMiniature/:armyId/:miniatureId/:stepIndex/:pictureId",
	checkAuth,
	UploadController.deleteFromMiniature
)

module.exports = router
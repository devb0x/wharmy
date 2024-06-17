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

router.delete(
	"/delete/:miniatureId",
	checkAuth,
	UploadController.delete
)

module.exports = router
const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/check-auth')
const upload = require("../middleware/multer")

const UploadController = require("../controllers/upload")

router.post(
	"/upload",
	checkAuth,
	upload.single('file'),
	UploadController.upload
)

module.exports = router
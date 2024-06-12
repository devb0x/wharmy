const s3 = require('../config/aws-config')

exports.upload = (req, res) => {
	const fileContent = req.file.buffer // Use file buffer from Multer
	const ownerId = req.userData.userId

	const params = {
		Bucket: 'wharmy/army-images',
		Key: req.file.originalname, // Use original file name
		Body: fileContent, // Use file buffer
		ContentType: req.file.mimetype, // Set the content type
		Metadata: {
			ownerId: ownerId
		}
	}

	s3.upload(params, (err, data) => {
		if (err) {
			console.error('Error uploading to S3:', err)
			return res.status(500).send(err)
		}
		res.status(200).send(data)
	})
}

const s3 = require('../config/aws-config')
const Army = require('../models/army')
const Picture = require('../models/picture')

exports.upload = async (req, res) => {
	try {
		const ownerId = req.userData.userId;
		const armyId = req.body.armyId;
		const files = req.files; // This will be an array of files
		const newPictures = []

		if (!ownerId) {
			return res.status(400).send({ message: 'Owner ID is required' });
		}

		if (!armyId) {
			return res.status(400).send({ message: 'Army ID is required' });
		}

		if (!files || files.length === 0) {
			return res.status(400).send({ message: 'No files were uploaded' });
		}

		for (const file of files) {
			try {
				console.log(`Processing file: ${file.originalname}`);

				const fileName = file.originalname
				const fileContent = file.buffer // Use file buffer from Multer
				// Check if file already exists in the database based on file name
				const existingMiniature = await Picture.findOne({
					fileName,
					ownerId,
					armyId
				})

				if (existingMiniature) {
					console.log(`File ${fileName} already exists in the database.`);
					continue // Skip this file if it already exists
				}

				const params = {
					Bucket: 'wharmy/army-images',
					Key: `${ownerId}/${armyId}/${file.originalname}`, // Use original file name
					Body: fileContent, // Use file buffer
					ContentType: file.mimetype, // Set the content type
					Metadata: {
						ownerId: ownerId,
						armyId: armyId
					}
				};

				console.log(`Uploading file to S3: ${fileName}`)
				// Upload the file to S3
				const data = await s3.upload(params).promise()
				console.log(`File uploaded to S3: ${fileName}`)

				// Create a new file record
				const newPicture = new Picture({
					ownerId: ownerId,
					armyId: armyId,
					fileName: fileName,
					fileUrl: data.Location, // S3 URL of the uploaded file
					uploadDate: new Date()
				});

				console.log(`Saving file metadata to MongoDB: ${fileName}`)
				// Save the file record to MongoDB
				await newPicture.save()
				console.log(`File metadata saved to MongoDB: ${fileName}`)
				newPictures.push(newPicture._id)
			} catch (fileError) {
				console.error(`Error processing file: ${file.originalname}`, fileError);
				// If needed, you can choose to return an error response or continue processing other files
				return res.status(500).send({ message: `Error processing file: ${file.originalname}`, error: fileError });
			}
		}

		// Update the Army document by pushing the new picture ObjectIds to the pictures array
		await Army.findByIdAndUpdate(
			armyId,
			{$push: {pictures: {$each: newPictures}}}, // Ensure correct syntax
			{new: true, useFindAndModify: false}
		)
		res.status(200).send({
			message: 'Files uploaded and metadata saved',
			data: newPictures
		});
	} catch (err) {
		console.error('Error uploading to S3 or saving to mongoDB', err);
		res.status(500).send(err);
	}
};


exports.delete = async (req, res) => {
	const ownerId = req.userData.userId

	try {
		const miniatureId = req.params.miniatureId

		if (!miniatureId) {
			return res.status(400).json({
				message: 'Miniature ID is required'
			})
		}

		// Delete miniature from the Miniature collection
		const miniature = await Picture.findByIdAndDelete(miniatureId);

		if (!miniature) {
			return res.status(404).json({message: 'Miniature not found'});
		}

		const { fileName } = miniature;
		const bucketName = 'wharmy';

		// Remove the miniature reference from the Army document
		await Army.updateOne(
			{_id: miniature.armyId},
			{$pull: {miniatures: miniatureId}}
		);

		// Delete the file from S3
		const params = {
			Bucket: bucketName,
			Key: `army-images/${ownerId}/${miniature.armyId}/${fileName}` // Ensure this path matches the S3 upload path
		};

		s3.deleteObject(params, (err, data) => {
			if (err) {
				console.error('Error deleting file from S3:', err);
				return res.status(500).json({message: 'Error deleting file from S3'});
			}

			res.status(200).json({message: 'Miniature deleted successfully'});
		})
	} catch (err) {
			console.error('Error deleting miniature', err);
			res.status(500).json({ message: 'Internal server error' });
	}
}

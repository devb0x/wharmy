const mongoose = require("mongoose")

const s3 = require('../config/aws-config')
const Army = require('../models/army')
const Picture = require('../models/picture')
const Miniature = require('../models/miniature')

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
		const pictureId = req.params.pictureId
		if (!pictureId) {
			return res.status(400).json({
				message: 'Miniature ID is required'
			})
		}

		// Delete miniature from the Picture collection
		const picture = await Picture.findByIdAndDelete(pictureId);
		if (!picture) {
			return res.status(404).json({message: 'Miniature not found'});
		}

		// Remove the miniature reference from the Army document
		await Army.updateOne(
			{_id: picture.armyId},
			{$pull: {pictures: pictureId}}
		)

		/**
		 * set the thumbnailUrl as empty string
		 * if the user delete the current picture set as thumbnail
		 */
		const army = await Army.findById(picture.armyId);
		if (army.thumbnailUrl === picture.fileUrl) {
			// Reset the thumbnailUrl
			await Army.updateOne(
				{ _id: picture.armyId },
				{ $set: { thumbnailUrl: '' } }
			)
		}

		const { fileName } = picture;
		const bucketName = 'wharmy';

		// Delete the file from S3
		const params = {
			Bucket: bucketName,
			Key: `army-images/${ownerId}/${picture.armyId}/${fileName}` // Ensure this path matches the S3 upload path
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

exports.uploadToMiniature = async (req, res) => {
	console.log(req.body);
	try {
		const ownerId = req.userData.userId;
		const { armyId, miniatureId, stepNumber } = req.body;
		const stepIndex = parseInt(stepNumber, 10);

		if (isNaN(stepIndex)) {
			return res.status(400).send({ message: 'Invalid step number' });
		}

		const files = req.files;
		const newPictures = [];

		if (!ownerId || !armyId || !files || files.length === 0) {
			return res.status(400).send({ message: 'Missing required fields or files' });
		}

		for (const file of files) {
			try {
				const fileName = file.originalname;
				const fileContent = file.buffer;

				// Check if file already exists in the database based on file name
				const existingMiniature = await Picture.findOne({
					fileName,
					ownerId,
					armyId
				});

				if (existingMiniature) {
					console.log(`File ${fileName} already exists in the database.`);
					continue;
				}

				// S3 upload parameters
				const params = {
					Bucket: 'wharmy/miniature-images',
					Key: `${ownerId}/${armyId}/${miniatureId}/${fileName}`,
					Body: fileContent,
					ContentType: file.mimetype,
					Metadata: {
						ownerId,
						armyId,
						miniatureId
					}
				};

				console.log(`Uploading file to S3: ${fileName}`);
				const data = await s3.upload(params).promise();
				console.log(`File uploaded to S3: ${fileName}`);

				// Create and save picture metadata to MongoDB
				const newPicture = new Picture({
					ownerId,
					armyId: new mongoose.Types.ObjectId(armyId),
					miniatureId: new mongoose.Types.ObjectId(miniatureId),
					fileName,
					fileUrl: data.Location,
					uploadDate: new Date()
				});

				console.log(`Saving file metadata to MongoDB: ${fileName}`);
				await newPicture.save();
				console.log(`File metadata saved to MongoDB: ${fileName}`);
				newPictures.push(newPicture._id);
			} catch (fileError) {
				console.error(`Error processing file: ${file.originalname}`, fileError);
				return res.status(500).send({ message: `Error processing file: ${file.originalname}`, error: fileError });
			}
		}

		// Update the specific step within the miniature
		const miniatureUpdateResult = await Miniature.updateOne(
			{ _id: miniatureId },
			{
				$push: { [`steps.${stepIndex}.pictures`]: { $each: newPictures } }
			}
		);

		res.status(200).send({
			message: 'Files uploaded and metadata saved',
			data: newPictures,
			updatedResult: miniatureUpdateResult
		});
	} catch (err) {
		console.error('Error uploading to S3 or saving to MongoDB', err);
		res.status(500).send(err);
	}
};

exports.deleteFromMiniature = async (req, res) => {
	const ownerId = req.userData.userId;
	const { armyId, miniatureId, stepIndex, pictureId } = req.params;

	// Validate parameters
	if (!pictureId || !armyId || !miniatureId || typeof stepIndex === 'undefined') {
		return res.status(400).json({ message: 'Invalid parameters' });
	}

	try {
		// Step 1: Delete the picture document from MongoDB
		const picture = await Picture.findByIdAndDelete(pictureId);
		if (!picture) {
			return res.status(404).json({ message: 'Picture not found' });
		}

		// Step 2: Fetch the Miniature document
		const miniature = await Miniature.findById(miniatureId);
		if (!miniature) {
			return res.status(404).json({ message: 'Miniature not found' });
		}

		// Check if the specified step index exists
		if (!miniature.steps[stepIndex]) {
			return res.status(404).json({ message: `Step index ${stepIndex} not found in miniature` });
		}

		// Remove the pictureId from the step's pictures array only if it exists
		const removed = miniature.steps[stepIndex].pictures.pull(pictureId);
		if (!removed) {
			return res.status(404).json({ message: 'Picture ID not found in step pictures' });
		}

		// Step 2.5: Check and reset thumbnailUrl if needed
		if (miniature.thumbnailUrl === picture.fileUrl) {
			miniature.thumbnailUrl = '';  // Reset the thumbnail URL
		}

		// Save the updated Miniature document
		await miniature.save();

		// Step 3: Delete the file from S3
		const params = {
			Bucket: 'wharmy/miniature-images',
			Key: `${ownerId}/${armyId}/${miniatureId}/${picture.fileName}`,
		};

		s3.deleteObject(params, (err, data) => {
			if (err) {
				console.error('Error deleting file from S3:', err);
				return res.status(500).json({ message: 'Error deleting file from S3' });
			}
			res.status(200).json({ message: 'Picture deleted successfully' });
		});
	} catch (err) {
		console.error('Error deleting miniature picture:', err);
		res.status(500).json({ message: 'Internal server error' });
	}
};







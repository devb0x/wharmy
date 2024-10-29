const Army = require('../models/army')
const Picture = require("../models/picture")

const s3 = require('../config/aws-config')

exports.createNewArmy = (req, res, next) => {
	const army = new Army({
		ownerId: req.userData.userId,
		category: req.body.category,
		subCategory: req.body.subCategory,
		name: req.body.name
	})
	army.save()
		.then(result => {
			res.status(201).json({
				message: 'New Collection created',
				result: result
			})
		})
		.catch(err => {
			res.status(500).json({
				message: 'Invalid arguments'
			})
		})
}

exports.getUserArmies = (req, res, next) => {
	const ownerId = req.query.userId

	if (!ownerId) {
		return res.status(400).json({ message: 'Missing ownerId parameter' });
	}

	Army
		.find({ownerId: ownerId})
		.then(armies => {
			if (armies && armies.length > 0) {
				res.status(200).json(armies)
			} else {
				res.status(404).json({ message: 'Armies not found '})
			}
		})
		.catch(error => {
			res.status(500).json({
				message: "Fetching Armies failed!"
			})
		})
}

exports.getAllArmies = (req, res, next) => {
	Army
		.find()
		.then(armies => {
			if (armies && armies.length > 0) {
				res.status(200).json(armies)
			} else {
				res.status(404).json({ message: 'Armies not found '})
			}
		})
		.catch(error => {
			res.status(500).json({
				message: "Fetching Armies failed!"
			})
		})
}

exports.searchArmies = (req, res, next) => {
	const query = req.query.query

	Army
		.find({ name: { $regex: query, $options: 'i' } })
		.then(armies => {
			res.status(200).json(armies)
		})
		.catch(error => {
			res.status(500).json({
				message: "Fetching Armies failed!"
			})
		})
}

exports.getArmy = (req, res, next) => {
	const id = req.params.armyId

	Army
		.findById(id).populate('pictures')
		.then(army => {
			if (army) {
				res.status(200).json(army)
			} else {
				res.status(404).json({ message: 'Army not found '})
			}
		})
		.catch(error => {
			res.status(500).json({
				message: "Fetching Army failed!"
			})
		})
}

exports.updateArmy = (req, res, next) => {
	const updatedData = {
		description: req.body.description,
		lore: req.body.lore
	}

	Army
		.updateOne({_id: req.params.armyId}, updatedData)
		.then(result => {
			if (result.modifiedCount > 0) {
				res.status(200).json({ message: 'Army document updated successfully' })
			} else {
				res.status(404).json({ message: 'No army document was updated' })
			}
		})
		.catch(error => {
			console.error('Error updating army document:', error)
			res.status(500).json({ message: 'Internal server error' })
		})
}

exports.deleteArmy = async (req, res, next) => {
	const armyId = req.params.armyId;

	try {
		// Fetch the army to get all miniatures
		const army = await Army.findById(armyId);

		if (!army) {
			return res.status(404).json({ message: 'Army not found' });
		}

		// Find all pictures related to the armyId (army-level pictures)
		const armyPictures = await Picture.find({ armyId });

		// Delete the army-level files from AWS S3
		const s3DeleteArmyPictures = armyPictures.map((picture) => {
			const params = {
				Bucket: 'wharmy/army-images',
				Key: `${picture.ownerId}/${picture.armyId}/${picture.fileName}`
			};
			return s3.deleteObject(params).promise();
		});
		await Promise.all(s3DeleteArmyPictures);

		// Now, handle the deletion of miniature-level pictures
		await Promise.all(
			army.miniatures.map(async (miniature) => {
				console.log(`Processing miniature: ${miniature._id}`); // Log the miniature ID being processed

				// Fetch all pictures related to this miniature
				const miniaturePictures = await Picture.find({ miniatureId: miniature._id });

				if (miniaturePictures.length > 0) {
					// Create delete promises for each picture in the miniature folder
					const s3DeleteMiniaturePictures = miniaturePictures.map((picture) => {
						const params = {
							Bucket: 'wharmy/miniature-images',
							Key: `${picture.ownerId}/${picture.armyId}/${picture.miniatureId}/${picture.fileName}`
						};
						console.log(`Deleting miniature picture: ${params.Key}`); // Log the S3 key being deleted
						return s3.deleteObject(params).promise();
					});

					// Wait for all deletions to complete
					await Promise.all(s3DeleteMiniaturePictures);

					// Delete the army-level pictures from the mongoDB database
					await Picture.deleteMany({ armyId });
				} else {
					console.log(`No pictures found for miniature: ${miniature._id}`);
				}
			})
		);

		// Finally, delete the army itself
		await Army.findByIdAndDelete(armyId);

		// Send a success response
		res.status(200).json({ message: 'Army and its miniatures deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error, could not delete army' });
	}
};

exports.deleteMiniature = async (req, res, next) => {
	const armyId = req.params.armyId;
	const miniatureId = req.params.miniatureId;

	try {
		// Fetch all pictures related to this miniature
		const miniaturePictures = await Picture.find({ armyId, miniatureId });

		// Delete the pictures from AWS S3
		const s3DeletePromises = miniaturePictures.map((picture) => {
			const params = {
				Bucket: 'wharmy/miniature-images', // Replace with your actual bucket name
				Key: `${picture.ownerId}/${picture.armyId}/${picture.miniatureId}/${picture.fileName}`
			};
			return s3.deleteObject(params).promise();
		});
		await Promise.all(s3DeletePromises);

		// First, delete all pictures related to this miniature from the Picture collection
		await Picture.deleteMany({ armyId, miniatureId });

		// Find the army and remove the miniature from the 'miniatures' array
		const updatedArmy = await Army.findByIdAndUpdate(
			armyId,
			{ $pull: { miniatures: { _id: miniatureId } } }, // Use $pull to remove the miniature by its _id
			{ new: true } // Return the updated document
		);

		if (!updatedArmy) {
			return res.status(404).json({ message: 'Army not found' });
		}

		res.status(200).json({ message: 'Miniature deleted successfully', army: updatedArmy });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error, could not delete miniature' });
	}
};


exports.addMiniatureToTheArmy = async (req, res, next) => {
	const { armyId } = req.params.id
	const { name } = req.body
	const userId = req.userData._id

	const newMiniature = {
		name: name,
		ownerId: userId,
		armyId: armyId,
		steps: [],
	}

	try {
		const updateArmy = await Army.findByIdAndUpdate(
			{_id: req.params.id},
			{ $push: { miniatures: newMiniature } },
			{ new: true }
		)
		res.status(200).json(updateArmy)
	} catch (error) {
		console.error('Error adding miniature', error)
		res.status(500).json({ error: 'Failed to add miniature to the army'})
	}
}

exports.updateThumbnail = async (req, res, next) => {
	// Extract the thumbnail ID from the request body
	const { thumbnail } = req.body;

	let thumbnailUrl = { thumbnailUrl: '' };

	if (thumbnail) {
		try {
			const picture = await Picture.findById(thumbnail);
			if (picture) {
				// If picture is found, set the new thumbnail URL
				thumbnailUrl = { thumbnailUrl: picture.fileUrl };
			} else {
				// If picture is not found, return a 404 error
				return res.status(404).json({ message: 'Picture not found' });
			}

			// Update the Army document with the new thumbnail URL
			const result = await Army.updateOne({ _id: req.params.id }, thumbnailUrl);

			if (result.modifiedCount > 0) {
				res.status(200).json({ message: 'Army document updated successfully' });
			} else {
				res.status(404).json({ message: 'No army document was updated' });
			}
		} catch (error) {
			console.error('Error updating army document:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	} else {
		res.status(400).json({ message: 'Thumbnail ID is required' });
	}
};

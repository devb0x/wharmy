const Army = require('../models/army')
const Picture = require("../models/picture")

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

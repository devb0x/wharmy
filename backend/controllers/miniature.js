const Army = require("../models/army")
const Picture = require("../models/picture")

/**
 * get a single miniature from the specific id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.getMiniature = async (req, res) => {
	const { armyId, miniatureId } = req.params;

	try {
		const army = await Army
			.findById(armyId)
			.populate({
				path: 'miniatures.steps.pictures',
				model: 'Picture'
			})
		if (!army) {
			return res.status(404).json({ error: 'Army not found' });
		}

		const miniature = army.miniatures.id(miniatureId);
		if (!miniature) {
			return res.status(404).json({ error: 'Miniature not found' });
		}

		res.json(miniature);
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
};

exports.addStepToMiniature = async (req, res) => {
	const { armyId, miniatureId } = req.params;
	const { number, title, description, paintsUsed, pictures } = req.body;

	try {
		const army = await Army.findById(armyId);
		if (!army) {
			return res.status(404).json({ error: 'Army not found' });
		}

		const miniature = army.miniatures.id(miniatureId);

		if (!miniature) {
			return res.status(404).json({ error: 'Miniature not found' });
		}

		// Check if all miniatures already have the required fields set
		const allMiniaturesValid = army.miniatures.every(
			(mini) => mini.armyId && mini.ownerId
		);

		// Only run the loop if some miniatures are missing required fields
		if (!allMiniaturesValid) {
			army.miniatures.forEach((mini) => {
				if (!mini.armyId) {
					mini.armyId = army._id;  // Set the armyId
				}
				if (!mini.ownerId) {
					mini.ownerId = army.ownerId;  // Set the ownerId
				}
			});
		}

		// Create new step
		const newStep = {
			number,
			title,
			description,
			paintsUsed: paintsUsed || [],
			pictures: pictures || [],
		};
		console.log(newStep);

		// Add new step to the miniature
		miniature.steps.push(newStep);

		// Save the modified army document
		await army.save();

		res.status(200).json({ message: 'Step added successfully', miniature });
	} catch (error) {
		console.error('Error adding step to miniature:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

exports.editStepToMiniature = async (req, res) => {
	const { armyId, miniatureId } = req.params
	const { number, title, description, paintsUsed } = req.body

	try {
		const army = await Army.findById(armyId)
		if (!army) {
			return res.status(404).json({error: 'Army not found'})
		}

		const miniature = army.miniatures.id(miniatureId)

		if (!miniature) {
			return res.status(404).json({error: 'Miniature not found'});
		}

		const step = miniature.steps.find(step => step.number === parseInt(number, 10));
		if (!step) {
			return res.status(404).json({ error: 'Step not found' })
		}

		step.title = title;
		step.description = description;
		step.paintsUsed = paintsUsed || [];

		await army.save()

	} catch (error) {
		console.error('Error adding step to miniature:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

exports.updateThumbnail = async (req, res) => {
	const { armyId, miniatureId, pictureId } = req.body;

	try {
		// Find the picture to get its URL
		const picture = await Picture.findById(pictureId);
		if (!picture) {
			return res.status(404).json({ message: 'Picture not found' });
		}

		const thumbnailUrl = picture.fileUrl; // Extract the file URL from the picture document

		// Update the specific miniature's thumbnailUrl inside the army document
		const result = await Army.updateOne(
			{ _id: armyId, "miniatures._id": miniatureId },
			{ $set: { "miniatures.$.thumbnailUrl": thumbnailUrl } }
		);

		if (result.modifiedCount > 0) {
			res.status(200).json({ message: 'Thumbnail updated successfully' });
		} else {
			res.status(404).json({ message: 'No miniature was updated' });
		}
	} catch (error) {
		console.error('Error updating thumbnail:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

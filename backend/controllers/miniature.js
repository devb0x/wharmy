const mongoose = require("mongoose")

const Army = require("../models/army")
const Picture = require("../models/picture")
const Miniature = require("../models/miniature")

/**
 * get a single miniature from the specific id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.getMiniature = (req, res, next) => {
	const id = req.params.miniatureId;

	Miniature.findById(id)
		.populate({
			path: 'steps.pictures', // Populate pictures inside steps
			model: 'Picture'
		})
		.then(miniature => {
			if (miniature) {
				res.status(200).json(miniature);
			} else {
				res.status(404).json({ message: 'Miniature not found' });
			}
		})
		.catch(error => {
			console.error("Error fetching miniature:", error);
			res.status(500).json({ message: "Fetching Miniature failed!" });
		});
};

exports.searchMiniatures = (req, res, next) => {
	const query = req.query.query

	Miniature
		.find({ name: { $regex: query, $options: 'i' } })
		.then(miniatures => {
			res.status(200).json(miniatures)
		})
		.catch(error => {
			res.status(500).json({
				message: "Fetching Miniatures failed!"
			})
		})
}

exports.getMiniatureById = async (req, res) => {
	const { armyId, miniatureId } = req.params;

	// Verify that the IDs are valid MongoDB ObjectIds
	if (!mongoose.Types.ObjectId.isValid(armyId) || !mongoose.Types.ObjectId.isValid(miniatureId)) {
		return res.status(400).json({ message: 'Invalid armyId or miniatureId format' });
	}

	try {
		console.log('Fetching miniature - Army ID:', armyId, 'Miniature ID:', miniatureId);

		// Fetch the army document and populate the specific miniature
		const army = await Army.findById(armyId).populate({
			path: 'miniatures',
			match: { _id: miniatureId },
		});

		if (!army) {
			return res.status(404).json({ message: 'Army not found' });
		}

		// Since we filtered miniatures by miniatureId, check if we got any result
		const miniature = army.miniatures.length ? army.miniatures[0] : null;
		if (!miniature) {
			return res.status(404).json({ message: 'Miniature not found within the specified army' });
		}

		res.status(200).json(miniature);
	} catch (error) {
		console.error('Error fetching miniature:', error);
		res.status(500).json({ message: 'Failed to retrieve miniature', error: error.message });
	}
};

exports.addStepToMiniature = async (req, res) => {
	const { miniatureId } = req.params;
	const { number, title, description, paintsUsed, pictures } = req.body;

	try {
		// Find the miniature by its ID
		const miniature = await Miniature.findById(miniatureId);
		if (!miniature) {
			return res.status(404).json({ error: 'Miniature not found' });
		}

		// Create the new step object
		const newStep = {
			number,
			title,
			description,
			paintsUsed: paintsUsed || [],
			pictures: pictures || [],
		};

		// Add the new step to the miniature's steps array
		miniature.steps.push(newStep);

		// Save the updated miniature
		await miniature.save();

		res.status(200).json({ message: 'Step added successfully', miniature });
	} catch (error) {
		console.error('Error adding step to miniature:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

exports.editStepToMiniature = async (req, res) => {
	const { miniatureId } = req.params;
	const { number, title, description, paintsUsed } = req.body;

	try {
		// Find the miniature by its ID
		const miniature = await Miniature.findById(miniatureId);
		if (!miniature) {
			return res.status(404).json({ error: 'Miniature not found' });
		}

		// Find the step by its number
		const step = miniature.steps.find(step => step.number === parseInt(number, 10));
		if (!step) {
			return res.status(404).json({ error: 'Step not found' });
		}

		// Update the step fields
		step.title = title;
		step.description = description;
		step.paintsUsed = paintsUsed || [];

		// Save the updated miniature
		await miniature.save();

		res.status(200).json({ message: 'Step updated successfully', miniature });
	} catch (error) {
		console.error('Error editing step in miniature:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};


exports.updateThumbnail = async (req, res) => {
	const { miniatureId, pictureId } = req.body;

	try {
		// Find the picture to get its URL
		const picture = await Picture.findById(pictureId);
		if (!picture) {
			return res.status(404).json({ message: 'Picture not found' });
		}

		const thumbnailUrl = picture.fileUrl; // Extract the file URL from the picture document

		// Update the specific miniature's thumbnailUrl directly
		const result = await Miniature.updateOne(
			{ _id: miniatureId },
			{ $set: { thumbnailUrl: thumbnailUrl } }
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


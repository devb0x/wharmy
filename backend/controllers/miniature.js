const Army = require("../models/army")

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
	const { armyId, miniatureId } = req.params
	const { number, title, description, paintsUsed, pictures } = req.body

	try {
		const army = await Army.findById(armyId)
		if (!army) {
			return res.status(404).json({ error: 'Army not found' })
		}

		const miniature = army.miniatures.id(miniatureId)

		if (!miniature) {
			return res.status(404).json({ error: 'Miniature not found' });
		}

		// Ensure the miniature has the necessary fields
		if (!miniature.armyId) {
			miniature.armyId = armyId; // Set the armyId if it's missing
		}
		if (!miniature.ownerId) {
			miniature.ownerId = army.ownerId; // Set the ownerId if it's missing
		}

		const newStep = {
			number,
			title,
			description,
			paintsUsed: paintsUsed || [],
			pictures: pictures || []
		}
		console.log(newStep)

		miniature.steps.push(newStep)

		await army.save()

		res.status(200).json({ message: 'Step added successfully', miniature })

	} catch (error) {
		console.error('Error adding step to miniature:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

exports.editStepToMiniature = async (req, res) => {
	console.log('edit step backend controller miniature')
	const { armyId, miniatureId } = req.params
	const { number, title, description, paintsUsed, pictures } = req.body

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
		step.pictures = pictures || [];

		await army.save()


	} catch (error) {
		console.error('Error adding step to miniature:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

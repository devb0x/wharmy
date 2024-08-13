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
		const army = await Army.findById(armyId).exec();
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
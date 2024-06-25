const Miniature = require('../models/miniature')

exports.getRecentMiniatures = (req, res, next) => {
	Miniature
		.find({})
		.sort({ uploadDate: -1 })
		.limit(5)
		.select('_id fileName fileUrl uploadDate')
		.then(miniatures => {
			if (miniatures && miniatures.length > 0) {
				res.status(200).json(miniatures)
			} else {
				res.status(404).json({ message: 'Armies not found '})
			}
		})
		.catch(error => {
			res.status(500).json({
				message: "Fetching Miniatures failed!"
			})
		})
}


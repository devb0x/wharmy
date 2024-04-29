const Army = require('../models/army')

exports.createNewArmy = (req, res, next) => {
	console.log("create collection from node called")
	console.log(req.userData.userId)
	console.log(req.body)
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
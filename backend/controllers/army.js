const Army = require('../models/army')

const multer = require('multer')
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
})




// exports.uploadImage = (req, res) => {
// 	console.log(req)
// 	upload.single('image')(req, res, (err) => {
// 		if (err) {
// 			return res.status(500).json({ error: 'Error uploading file to S3', details: err });
// 		}
// 		res.status(200).json({ message: 'File uploaded successfully' });
// 	});
//
// 	// s3.putObject({
// 	// 	Body: "hello world",
// 	// 	Bucket: "wharmy",
// 	// 	Key: "my-file.txt"
// 	// })
// 	// s3.upload(req.body)
// };

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'wharmy',
		metadata: (req, file, cb) => {
			cb(null, { fieldName: file.fieldname });
		},
		key: (req, file, cb) => {
			// const armyId = req.body.armyId; // Get armyId from request body
			const armyId = "6646fcf9192ee868ac065dc0"; // Get armyId from request body
			cb(null, `army-images/${armyId}/${file.originalname}`);
		}
	})
});
exports.uploadImage = (req, res) => {

	console.log('backend upload image fn called')
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded' });
	}

	// const armyId = req.body.armyId; // Ensure armyId is included in the form data
	const armyId = "6646fcf9192ee868ac065dc0"; // Ensure armyId is included in the form data
	const params = {
		Bucket: 'your-bucket-name',
		Key: `army-images/${armyId}/${req.file.originalname}`,
		Body: req.file.buffer,
		ContentType: req.file.mimetype
	};


	s3.upload(params, (err, data) => {
		if (err) {
			return res.status(500).json({ error: 'Error uploading file to S3' });
		}
		res.status(200).json({ message: 'File uploaded successfully', data });
	});
};

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
	const id = req.params.id

	Army
		.findById(id)
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
		.updateOne({_id: req.params.id}, updatedData)
		.then(result => {
			if (result.modifiedCount > 0) {
				res.status(200).json({ message: 'Army document updated successfully' });
			} else {
				res.status(404).json({ message: 'No army document was updated' });
			}
		})
		.catch(error => {
			console.error('Error updating army document:', error)
			res.status(500).json({ message: 'Internal server error' })
		});
}

// exports.uploadImage = (req, res, next) => {
// 	let upload = (req, res, function (err) {
// 		// if (err) {
// 		// 	return res.status(500).json({ error: 'Error uploading file' });
// 		// }
//
// 		// console.log(req.body)
// 		// console.log(req.params)
// 		const armyId = req.body.armyId;
// 		const fileContent = Buffer.from(req.file.buffer, 'binary');
// 		const params = {
// 			Bucket: 'wharmy',
// 			Key: `army-images/6646f5f25afd7f1656518c6b/${req.file.originalname}`, // Key including the folder structure
// 			Body: fileContent,
// 			ContentType: req.file.mimetype
// 		};
//
// 		s3.upload(params, (err, data) => {
// 			// console.log(data)
// 			// console.log(params.Key)
// 			if (err) {
// 				return res.status(500).json({ error: 'Error uploading file to S3' });
// 			}
// 			res.status(200).json({ message: 'File uploaded successfully', data });
// 		});
// 	});
// };
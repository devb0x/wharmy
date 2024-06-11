const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")

const AWS = require('aws-sdk')

const userRoutes = require('./routes/user')
const armyRoutes = require('./routes/army')
const multer = require("multer")
const fs = require('fs')

mongoose
	.connect(`mongodb+srv://devb0x:${process.env.MONGO_ATLAS_PW}@cluster0.uhohovv.mongodb.net/node-angular?retryWrites=true&w=majority&appName=Cluster0`)
	.then(() => {
		console.log('Connected to database.')
	})
	.catch(() => {
		console.log('Connection failed!')
	})

const app = express()

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))



app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-Width, Content-Type, Accept, Authorization"
	)
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, DELETE, OPTIONS"
	)
	next()
})


const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
	const fileContent = fs.readFileSync(req.file.path);

	const params = {
		Bucket: 'wharmy/army-images',
		Key: req.file.originalname,
		Body: fileContent
	};

	s3.upload(params, (err, data) => {
		if (err) {
			console.error('Error uploading to S3:', err)
			return res.status(500).send(err);
		}
		res.status(200).send(data);
	});
});



app.use("/api/user", userRoutes)
app.use("/api/army", armyRoutes)
app.get("/api/user/dummy")

module.exports = app
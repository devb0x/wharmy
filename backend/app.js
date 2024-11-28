const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const path = require('path');
const cors = require("cors")
const app = express()

const userRoutes = require('./routes/user')
const armyRoutes = require('./routes/army')
const uploadRoutes = require('./routes/upload')
const pictureRoutes = require('./routes/picture')
const miniatureRoutes = require('./routes/miniature')


mongoose
	.connect(`mongodb+srv://devb0x:${process.env.MONGO_ATLAS_PW}@cluster0.uhohovv.mongodb.net/node-angular?retryWrites=true&w=majority&appName=Cluster0`)
	.then(() => {
		console.log('Connected to database.')
	})
	.catch((err) => {
		console.log(err)
		console.log('Connection failed!')
	})

app.use(express.static(path.join(__dirname, '../src')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../src/index.html'));
});


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

app.options('*', cors())

app.use("/backend/user", userRoutes)
app.use("/backend/army", armyRoutes)
app.use("/backend/army", miniatureRoutes)
app.use("/backend", uploadRoutes)
app.use("/backend", pictureRoutes)

app.get("/backend/user/dummy")

module.exports = app
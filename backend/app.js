const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")

const userRoutes = require('./routes/user')

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

app.use("/api/user", userRoutes)

module.exports = app
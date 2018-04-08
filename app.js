const express = require("express");
const app = express();
const keys = require('./config/keys');

// Middlewares
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const morgan = require('morgan');
//Routes
const postsRoutes = require("./api/routes/posts");


mongoose.connect(keys.mongoURI, {});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS handling
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

// Routes to handle requests
app.use("/posts", postsRoutes);

// Error handling
app.use((req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
});
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});
module.exports = app;


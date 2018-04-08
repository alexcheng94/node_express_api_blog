const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const Post = require("../models/post");

router.get("/", (req, res, next) => {
	Post.find()
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				post: docs.map(doc => {
					return {
						_id: doc._id,
						title: doc.title,
						author: doc.author,
						content: doc.content,
						date: doc.date,
						request: {
							type: "GET",
							url: "http://" + req.headers.host + "/" + doc._id
						}
					};
					
				})
			};
			if (docs.length > 0) {
				res.status(200).json(response);
			}else {
				res.status(200).json({
					message: 'No entries found'
				})
			}
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

router.post("/", (req, res, next) => {
	const post = new Post({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		author: req.body.author,
		content: req.body.content,
		date: new Date().toISOString()
	});
	post
		.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: "Post successfully created",
				createdPost: {
					_id: result._id,
					title: result.title,
					author: result.author,
					content: result.content,
					date: result.date
				},
				request: {
					type: "GET",
					url: req.headers.host + "/" + result._id
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;

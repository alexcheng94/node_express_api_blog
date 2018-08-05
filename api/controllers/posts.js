const Post = require("../models/post");
const mongoose = require("mongoose");

exports.get_all_posts = (req, res, next) => {
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
							type: "GET DELETE PATCH",
							url: req.protocol + "://" + req.headers.host + "/posts/" + doc._id
						}
					};
				})
			};
			if (docs.length > 0) {
				res.status(200).json(response);
			} else {
				res.status(200).json({
					message: "No entries found"
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
};

exports.get_one_post = (req, res, next) => {
	const id = req.params.postId;
	Post.findById(id)
		.exec()
		.then(doc => {
			if (doc) {
				res.status(200).json({
					_id: doc._id,
					title: doc.title,
					author: doc.author,
					content: doc.content,
					request: {
						type: "DELETE PATCH",
						url: req.protocol + "://" + req.headers.host + req.originalUrl
					}
				});
			} else {
				res.status(404).json({
					message: "Invalid postId, no matching entry found"
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
};

//============ protected routes ====================
exports.post_new_article = (req, res, next) => {
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
					type: "GET DELETE PATCH",
					url: req.protocol + "://" + req.headers.host + "/posts/" + result._id
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.update_post = (req, res, next) => {
	const id = req.params.postId;
	// Check which part(s) does user want to update
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}

	Post.update({ _id: id }, { $set: updateOps })
		.exec()
		.then(result => {
			res.status(200).json({
				message: "update SUCCESSFUL",
				request: {
					type: "GET DELETE",
					url: req.protocol + "://" + req.headers.host + req.originalUrl
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
};

exports.delete_post = (req, res, next) => {
	id = req.params.postId;
	Post.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Entry successfully deleted",
				request: {
					type: "GET POST",
					url: req.protocol + "://" + req.headers.host + "/posts"
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
};

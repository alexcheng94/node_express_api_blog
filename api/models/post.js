const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = mongoose.Schema({
	title: {type: String, required: true},
	author: {type: Schema.Types.ObjectId, ref: 'User'},
	content: {type: String, required: true},
	date: {type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);
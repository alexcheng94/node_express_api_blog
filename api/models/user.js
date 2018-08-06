const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true },
  posts: [{type: Schema.Types.ObjectId, ref: 'Post' }]
});

module.exports = mongoose.model("User", userSchema);

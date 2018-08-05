const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true }
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   match: //regExp goes here
  // }
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String },
  goal: { type: String },
  skills: [String],
  recommendations: [String],
});

module.exports = mongoose.model("UserProfile", userProfileSchema);

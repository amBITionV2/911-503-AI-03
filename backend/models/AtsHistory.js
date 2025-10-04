const mongoose = require("mongoose");

const atsHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeSkills: [String],
  jdSkills: [String],
  matched: [String],
  score: Number,
  jobDescription: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AtsHistory", atsHistorySchema);

const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { analyzeResume } = require("../utils/resumeAnalyzer.js");
const AtsHistory = require("../models/AtsHistory.js");

const router = express.Router();
const upload = multer();

// 🔹 Helper to get userId from token
const getUserIdFromToken = (req) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
};

// 🔹 Resume Analyzer (with ATS score storage)
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    const resumeBuffer = req.file.buffer;
    const userId = getUserIdFromToken(req);

    const result = await analyzeResume(resumeBuffer, jobDescription);

    // save to DB if logged in
    if (userId) {
      const record = new AtsHistory({
        userId,
        ...result,
        jobDescription
      });
      await record.save();
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Resume analysis failed", error: err.message });
  }
});

// 🔹 Fetch previous ATS history
router.get("/history", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const history = await AtsHistory.find({ userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history", error: err.message });
  }
});

module.exports = router;

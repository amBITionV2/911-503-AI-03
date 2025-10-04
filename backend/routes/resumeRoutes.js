const express = require("express");
const multer = require("multer");
const { analyzeResume } = require("../utils/resumeAnalyzer.js");

const router = express.Router();
const upload = multer();

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    const resumeBuffer = req.file.buffer;

    const result = await analyzeResume(resumeBuffer, jobDescription);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Resume analysis failed", error: err.message });
  }
});

module.exports = router;

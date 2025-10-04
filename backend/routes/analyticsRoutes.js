const express = require("express");
const jwt = require("jsonwebtoken");
const AtsHistory = require("../models/AtsHistory.js");
const router = express.Router();

// Helper to extract userId
const getUserIdFromToken = (req) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
};

// Get overall analytics
router.get("/summary", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const history = await AtsHistory.find({ userId });

  const totalApplications = history.length;
  const avgScore =
    history.reduce((acc, h) => acc + h.score, 0) / (history.length || 1);

  // Example: Course completion (mock for now)
  const totalCourses = 6;
  const completedCourses = 4;

  res.json({
    totalApplications,
    avgScore: Math.round(avgScore),
    totalCourses,
    completedCourses,
    timelineLeft: 30 // mock days remaining for learning goal
  });
});

module.exports = router;

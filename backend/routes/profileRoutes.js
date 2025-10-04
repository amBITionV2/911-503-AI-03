const express = require("express");
const jwt = require("jsonwebtoken");
const UserProfile = require("../models/UserProfile.js");
const router = express.Router();

// Helper to extract user ID from JWT
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

// Save or Update Profile
router.post("/save", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { name, goal, skills, recommendations } = req.body;

  try {
    let profile = await UserProfile.findOne({ userId });
    if (profile) {
      // Update existing
      profile.name = name;
      profile.goal = goal;
      profile.skills = skills;
      profile.recommendations = recommendations;
      await profile.save();
    } else {
      // Create new
      profile = new UserProfile({ userId, name, goal, skills, recommendations });
      await profile.save();
    }

    res.json({ message: "Profile saved successfully", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving profile" });
  }
});

// Fetch Profile
router.get("/get", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const profile = await UserProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

module.exports = router;

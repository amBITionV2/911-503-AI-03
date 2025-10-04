const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/recommend", async (req, res) => {
  const { missingSkills } = req.body;
  try {
    const response = await axios.post("http://localhost:6000/recommend", { missingSkills });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Course recommender service error", error: err.message });
  }
});

module.exports = router;

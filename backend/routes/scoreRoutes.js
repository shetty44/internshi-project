const router = require("express").Router();
const Score = require("../models/Score");
const authMiddleware = require("../middleware/authMiddleware");

// ➕ Create a score entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, score, timeSpent } = req.body;

    if (!subject || score === undefined || !timeSpent) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newScore = await Score.create({
      userId: req.userId,
      subject,
      score,
      timeSpent,
    });

    res.status(201).json({
      message: "Score recorded successfully",
      score: newScore,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📊 Get all scores for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.userId }).sort({
      date: -1,
    });

    res.json({
      message: "Scores retrieved successfully",
      scores,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📈 Get analytics (best score, average, etc.)
router.get("/analytics/summary", authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.userId });

    if (scores.length === 0) {
      return res.json({
        bestScore: 0,
        averageScore: 0,
        totalAssessments: 0,
        totalTimeSpent: 0,
        performanceByCategory: { Excellent: 0, Good: 0, Average: 0 },
      });
    }

    const bestScore = Math.max(...scores.map((s) => s.score));
    const averageScore =
      scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    const totalAssessments = scores.length;
    const totalTimeSpent = scores.reduce((sum, s) => sum + s.timeSpent, 0);

    const performanceByCategory = {
      Excellent: scores.filter((s) => s.category === "Excellent").length,
      Good: scores.filter((s) => s.category === "Good").length,
      Average: scores.filter((s) => s.category === "Average").length,
    };

    res.json({
      bestScore,
      averageScore: averageScore.toFixed(2),
      totalAssessments,
      totalTimeSpent,
      performanceByCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔍 Filter scores by subject
router.get("/filter/subject/:subject", authMiddleware, async (req, res) => {
  try {
    const { subject } = req.params;
    const scores = await Score.find({
      userId: req.userId,
      subject: subject,
    }).sort({ date: -1 });

    res.json({
      message: `Scores for ${subject}`,
      scores,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🗑️ Delete a score
router.delete("/:scoreId", authMiddleware, async (req, res) => {
  try {
    const { scoreId } = req.params;

    const score = await Score.findByIdAndDelete(scoreId);

    if (!score) {
      return res.status(404).json({ message: "Score not found" });
    }

    res.json({ message: "Score deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

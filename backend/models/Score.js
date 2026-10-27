const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      enum: ["Math", "Science", "English", "History", "Programming", "Physics", "Biology", "Chemistry", "Data Structures"],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    timeSpent: {
      type: Number,
      required: true,
      comment: "Time spent in minutes",
    },
    category: {
      type: String,
      enum: ["Excellent", "Good", "Average"],
      default: "Average",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-calculate category based on score
scoreSchema.pre("save", function (next) {
  if (this.score >= 80) {
    this.category = "Excellent";
  } else if (this.score >= 60) {
    this.category = "Good";
  } else {
    this.category = "Average";
  }
  next();
});

module.exports = mongoose.model("Score", scoreSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Score = require("./models/Score");
const connectDB = require("./config/db");

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("🌱 Seeding database...");

    // Clear existing data
    await User.deleteMany({});
    await Score.deleteMany({});
    console.log("✅ Cleared existing data");

    // Hash passwords
    const hashedAlice = await bcrypt.hash("alice123456", 10);
    const hashedBob = await bcrypt.hash("bob123456", 10);
    const hashedRahul = await bcrypt.hash("rahul123456", 10);
    const hashedPriya = await bcrypt.hash("priya123456", 10);
    const hashedArjun = await bcrypt.hash("arjun123456", 10);

    // Create users
    const alice = await User.create({
      name: "Alice Johnson",
      email: "alice@example.com",
      password: hashedAlice,
      role: "student"
    });

    const bob = await User.create({
      name: "Bob Smith",
      email: "bob@example.com",
      password: hashedBob,
      role: "student"
    });

    const rahul = await User.create({
      name: "Rahul Sharma",
      email: "rahul@example.com",
      password: hashedRahul,
      role: "student"
    });

    const priya = await User.create({
      name: "Priya Patel",
      email: "priya@example.com",
      password: hashedPriya,
      role: "student"
    });

    const arjun = await User.create({
      name: "Arjun Reddy",
      email: "arjun@example.com",
      password: hashedArjun,
      role: "student"
    });

    console.log("✅ Created sample users");

    // Create scores
    const scores = [
      // Alice
      { userId: alice._id, subject: "Math", score: 95, timeSpent: 45 },
      { userId: alice._id, subject: "Science", score: 88, timeSpent: 50 },
      { userId: alice._id, subject: "English", score: 92, timeSpent: 40 },

      // Bob
      { userId: bob._id, subject: "History", score: 78, timeSpent: 55 },
      { userId: bob._id, subject: "Programming", score: 96, timeSpent: 60 },

      // Rahul
      { userId: rahul._id, subject: "Math", score: 85, timeSpent: 50 },
      { userId: rahul._id, subject: "Physics", score: 89, timeSpent: 60 },

      // Priya
      { userId: priya._id, subject: "Biology", score: 91, timeSpent: 55 },
      { userId: priya._id, subject: "Chemistry", score: 87, timeSpent: 45 },

      // Arjun
      { userId: arjun._id, subject: "Programming", score: 98, timeSpent: 70 },
      { userId: arjun._id, subject: "Data Structures", score: 94, timeSpent: 65 }
    ];

    await Score.insertMany(scores);
    console.log("✅ Created sample scores");

    console.log("🎉 Database seeded successfully!");
    console.log("Sample users:");
    console.log("- alice@example.com / alice123456");
    console.log("- bob@example.com / bob123456");
    console.log("- rahul@example.com / rahul123456");
    console.log("- priya@example.com / priya123456");
    console.log("- arjun@example.com / arjun123456");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
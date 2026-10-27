import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import API from "../api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [newScore, setNewScore] = useState({
    subject: "Math",
    score: "",
    timeSpent: "",
  });
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const scoresRes = await API.get("/scores");
      const analyticsRes = await API.get("/scores/analytics/summary");

      setScores(scoresRes.data.scores || []);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async (e) => {
    e.preventDefault();

    try {
      await API.post("/scores", {
        subject: newScore.subject,
        score: parseInt(newScore.score),
        timeSpent: parseInt(newScore.timeSpent),
      });

      setNewScore({ subject: "Math", score: "", timeSpent: "" });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error("Error adding score:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredScores =
    filter === "All"
      ? scores
      : scores.filter((s) => s.subject === filter);

  const chartData = {
    labels: filteredScores.map((s) =>
      new Date(s.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Score",
        data: filteredScores.map((s) => s.score),
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ["Excellent", "Good", "Average"],
    datasets: [
      {
        label: "Performance",
        data: [
          analytics?.performanceByCategory?.Excellent || 0,
          analytics?.performanceByCategory?.Good || 0,
          analytics?.performanceByCategory?.Average || 0,
        ],
        backgroundColor: ["#2ecc71", "#f39c12", "#e74c3c"],
      },
    ],
  };

  if (loading) {
    return <div className="loading">📊 Loading your dashboard...</div>;
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="dashboard-header card">
        <div>
          <h1>🎓 Dashboard</h1>
          <p>Welcome, <strong>{user.name}</strong>!</p>
        </div>
        <div>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Score"}
          </button>
          <button onClick={handleLogout} style={{ background: "#e74c3c", marginLeft: "10px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Add Score Form */}
      {showForm && (
        <div className="card">
          <h3>Add New Assessment Score</h3>
          <form onSubmit={handleAddScore}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
              <div className="form-group">
                <label>Subject</label>
                <select
                  value={newScore.subject}
                  onChange={(e) =>
                    setNewScore({ ...newScore, subject: e.target.value })
                  }
                >
                  <option>Math</option>
                  <option>Science</option>
                  <option>English</option>
                  <option>History</option>
                  <option>Programming</option>
                </select>
              </div>

              <div className="form-group">
                <label>Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 85"
                  value={newScore.score}
                  onChange={(e) =>
                    setNewScore({ ...newScore, score: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Time Spent (minutes)</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g., 60"
                  value={newScore.timeSpent}
                  onChange={(e) =>
                    setNewScore({ ...newScore, timeSpent: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <button type="submit">📝 Record Score</button>
          </form>
        </div>
      )}

      {/* Analytics Cards */}
      {analytics && (
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Best Score</h3>
            <div className="value">{analytics.bestScore}</div>
          </div>
          <div className="analytics-card">
            <h3>Average Score</h3>
            <div className="value">{analytics.averageScore}</div>
          </div>
          <div className="analytics-card">
            <h3>Total Assessments</h3>
            <div className="value">{analytics.totalAssessments}</div>
          </div>
          <div className="analytics-card">
            <h3>Total Time Spent</h3>
            <div className="value">{analytics.totalTimeSpent} min</div>
          </div>
        </div>
      )}

      {/* Charts */}
      {filteredScores.length > 0 && (
        <div className="card">
          <h3>📈 Score Trends</h3>
          <div className="chart-container">
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      )}

      {analytics && (
        <div className="card">
          <h3>📊 Performance by Category</h3>
          <div className="chart-container">
            <Bar
              data={categoryData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      )}

      {/* Filter and Recent Scores */}
      <div className="card">
        <h3>📋 Recent Assessments</h3>
        <div className="filter-section">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Math</option>
            <option>Science</option>
            <option>English</option>
            <option>History</option>
            <option>Programming</option>
          </select>
        </div>

        {filteredScores.length > 0 ? (
          <div className="score-list">
            {filteredScores.map((score) => (
              <div key={score._id} className="score-item">
                <div>
                  <div className="subject">{score.subject}</div>
                  <small>
                    {new Date(score.date).toLocaleDateString()} - {score.timeSpent} min
                  </small>
                  <span
                    className={`badge ${score.category.toLowerCase()}`}
                  >
                    {score.category}
                  </span>
                </div>
                <div className="score">{score.score}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>
            No assessments yet. Add one to get started!
          </p>
        )}
      </div>
    </div>
  );
}

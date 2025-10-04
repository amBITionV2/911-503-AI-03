import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import "./../css/Dashboard.css";

function Dashboard() {
  const [summary, setSummary] = useState({});
  const [atsHistory, setAtsHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await axios.get("http://localhost:5000/api/analytics/summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res1.data);

      const res2 = await axios.get("http://localhost:5000/api/resume/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAtsHistory(res2.data);
    };
    fetchData();
  }, [token]);

  const COLORS = ["#00ff9d", "#007fff", "#ffcc00", "#ff0066"];

  const courseData = [
    { name: "Completed", value: summary.completedCourses || 0 },
    { name: "Pending", value: (summary.totalCourses || 0) - (summary.completedCourses || 0) },
  ];

  return (
    <div className="dash-dark">
      <h1 className="dash-title">📊 AI Career Dashboard</h1>

      {/* Top summary cards */}
      <div className="summary-grid">
        <div className="card">🏢 Companies Applied<br/><span>{summary.totalApplications || 0}</span></div>
        <div className="card">⚙️ Average ATS Score<br/><span>{summary.avgScore || 0}%</span></div>
        <div className="card">🎓 Courses Completed<br/><span>{summary.completedCourses || 0}/{summary.totalCourses || 0}</span></div>
        <div className="card">⏳ Timeline Left<br/><span>{summary.timelineLeft || 0} Days</span></div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-box">
          <h3>ATS Score Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={atsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" tickFormatter={(v)=> new Date(v).toLocaleDateString()}/>
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#00ff9d" strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Course Completion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={courseData} dataKey="value" nameKey="name" outerRadius={100}>
                {courseData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Applications by Score Range</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={atsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="score" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#007fff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

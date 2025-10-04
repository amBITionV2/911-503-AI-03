// App.js
import React, { useState } from "react";
import PathDisplay from "./components/PathDisplay"; // if your file is in /components, change to "./components/PathDisplay"
import "./styles.css";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [knownTopics, setKnownTopics] = useState("");
  const [maxCourses, setMaxCourses] = useState(10);
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setPath([]);

    try {
      const payload = {
        topic: topic.trim(),
        level,
        known_topics: knownTopics
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        max_courses: Number(maxCourses) || 10,
        user_id: "anon",
      };

      const res = await fetch(`${API_URL}/learning_path`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Backend error (${res.status}): ${t}`);
        // A 404 here would mean the backend isn't running on the URL/port you configured.
      }

      const data = await res.json();
      // Backend returns { learning_path: [...] }
      setPath(Array.isArray(data.learning_path) ? data.learning_path : []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Personalized Learning Path Generator</h1>

      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Topic (e.g., Machine Learning)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />

        {/* <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select> */}

        <input
          type="text"
          placeholder="Known topics (comma separated)"
          value={knownTopics}
          onChange={(e) => setKnownTopics(e.target.value)}
        />

        {/* <input
          type="number"
          min={1}
          max={50}
          value={maxCourses}
          onChange={(e) => setMaxCourses(e.target.value)}
        /> */}

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Path"}
        </button>
      </form>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <PathDisplay path={path} />
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import "./../css/CourseRecommender.css";

function CourseRecommender() {
  const [skills, setSkills] = useState("");
  const [courses, setCourses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingSkills = skills.split(",").map(s => s.trim());
    try {
      const res = await axios.post("http://localhost:5000/api/courses/recommend", { missingSkills });
      setCourses(res.data.recommendations || []);
    } catch (err) {
      alert("Error fetching recommendations");
    }
  };

  return (
    <div className="course-recommender">
      <h2>Course Recommender</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter missing skills (comma separated)"
          onChange={(e) => setSkills(e.target.value)} />
        <button type="submit">Recommend</button>
      </form>

      {courses.length > 0 && (
        <div className="result">
          <h3>Recommended Courses:</h3>
          <ul>
            {courses.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
export default CourseRecommender;

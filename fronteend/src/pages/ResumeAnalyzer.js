import { useState } from "react";
import axios from "axios";
import "./../css/ResumeAnalyzer.css";

function ResumeAnalyzer() {
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a resume");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDesc);

    try {
      const res = await axios.post("http://localhost:5000/api/resume/analyze", formData);
      setResult(res.data);
    } catch (err) {
      alert("Error analyzing resume");
    }
  };

  return (
    <div className="resume-analyzer">
      <h2>Resume Analyzer</h2>
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Paste Job Description" onChange={(e) => setJobDesc(e.target.value)} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Analyze</button>
      </form>

      {result && (
        <div className="result">
          <h3>Match Score: {result.score}%</h3>
          <p><b>Resume Skills:</b> {result.resumeSkills.join(", ")}</p>
          <p><b>JD Skills:</b> {result.jdSkills.join(", ")}</p>
          <p><b>Matched:</b> {result.matched.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
export default ResumeAnalyzer;

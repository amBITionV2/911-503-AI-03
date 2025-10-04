import React from "react";

function PathDisplay({ path }) {
  if (!path || path.length === 0) {
    return <p>No path generated yet.</p>;
  }

  return (
    <div className="path-container">
      {path.map((levelObj, idx) => (
        <div key={idx} className="level-card">
          <h2>Level {levelObj.level}</h2>
          <ul>
            {levelObj.courses.map((course, i) => (
              <li key={i}>{course}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default PathDisplay;

// src/components/PathDisplay.jsx
import React from "react";

export default function PathDisplay({ path }) {
  if (!path || path.length === 0) {
    return <p style={{ opacity: 0.8 }}>No items yet. Submit a topic to see your path.</p>;
  }

  return (
    <div className="path-list">
      {path.map((item, idx) => (
        <div className="path-card" key={idx}>
          <div className="path-card-header">
            <span className="badge">{item.level ?? `Step ${idx + 1}`}</span>
            <h3>{item.title || item.name || `Resource ${idx + 1}`}</h3>
          </div>

          {item.description && <p className="muted">{item.description}</p>}

          <ul className="meta">
            {item.provider && <li><strong>Provider:</strong> {item.provider}</li>}
            {item.duration && <li><strong>Duration:</strong> {item.duration}</li>}
            {item.skill && <li><strong>Skill:</strong> {item.skill}</li>}
            {Array.isArray(item.prerequisites) && item.prerequisites.length > 0 && (
              <li><strong>Prerequisites:</strong> {item.prerequisites.join(", ")}</li>
            )}
          </ul>

          {item.url && (
            <a className="link" href={item.url} target="_blank" rel="noreferrer">
              Open resource
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

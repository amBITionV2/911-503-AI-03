const pdf = require("pdf-parse");

const analyzeResume = async (resumeBuffer, jobDescription) => {
  const resumeText = (await pdf(resumeBuffer)).text.toLowerCase();
  const jdText = jobDescription.toLowerCase();

  const skills = ["python", "java", "react", "node", "ml", "ai", "sql", "aws"];
  const resumeSkills = skills.filter(s => resumeText.includes(s));
  const jdSkills = skills.filter(s => jdText.includes(s));

  const matched = resumeSkills.filter(s => jdSkills.includes(s));
  const score = jdSkills.length > 0 ? (matched.length / jdSkills.length) * 100 : 0;

  return { resumeSkills, jdSkills, matched, score: Math.round(score) };
};

module.exports = { analyzeResume };

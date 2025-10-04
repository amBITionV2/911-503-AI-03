import "./../css/Dashboard.css";

function Dashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <h2>Please login to access your dashboard.</h2>;
  }

  return (
    <div className="dashboard">
      <h2>Welcome to your Dashboard 🎉</h2>
      <p>Use the Resume Analyzer and Course Recommender from the navbar.</p>
    </div>
  );
}
export default Dashboard;

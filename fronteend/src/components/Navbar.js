import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <Link to="/" style={{ margin: "0 10px", color: "#fff" }}>Home</Link>
      {!token ? (
        <>
          <Link to="/login" style={{ margin: "0 10px", color: "#fff" }}>Login</Link>
          <Link to="/signup" style={{ margin: "0 10px", color: "#fff" }}>Signup</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard" style={{ margin: "0 10px", color: "#fff" }}>Dashboard</Link>
          <Link to="/resume" style={{ margin: "0 10px", color: "#fff" }}>Resume Analyzer</Link>
          <Link to="/courses" style={{ margin: "0 10px", color: "#fff" }}>Course Recommender</Link>
          <button onClick={logout} style={{ marginLeft: "10px" }}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;

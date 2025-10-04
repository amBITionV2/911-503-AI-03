import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="nav-container">
      {/* ===== Logo ===== */}
      <div className="nav-logo" onClick={() => navigate("/")}>
        Fair<span>Hire</span>
      </div>

      {/* ===== Navigation Links ===== */}
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/plans">Plans</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* ===== Right Section (Buttons) ===== */}
      <div className="nav-actions">
        {!token ? (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </>
        ) : (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;

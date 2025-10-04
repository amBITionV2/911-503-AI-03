import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../css/Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        role
      });
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>Signup</h2>
      <input type="text" placeholder="Name" onChange={(e)=>setName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

      <div className="role-select">
        <label>
          <input
            type="radio"
            value="user"
            checked={role === "user"}
            onChange={() => setRole("user")}
          />
          Normal User
        </label>
        <label>
          <input
            type="radio"
            value="company"
            checked={role === "company"}
            onChange={() => setRole("company")}
          />
          Company
        </label>
      </div>

      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;

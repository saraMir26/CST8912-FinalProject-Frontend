import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
    navigate("/feed");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await client.post("/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/feed");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit">Login</button>
        </div>
      </form>

      <p style={{ marginTop: "15px" }}>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
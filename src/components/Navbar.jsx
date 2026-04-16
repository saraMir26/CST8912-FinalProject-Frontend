import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={{ padding: "15px", borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
      <a href="/chat" target="_blank" rel="noreferrer" style={{ marginRight: "15px" }}>
        Chat
      </a>
      <Link to="/feed" style={{ marginRight: "15px" }}>Feed</Link>
      <Link to="/profile" style={{ marginRight: "15px" }}>Profile</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
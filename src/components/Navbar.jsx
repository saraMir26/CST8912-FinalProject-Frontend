import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";
import "../App.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.id) {
      loadMyProfile();
    }
  }, []);

  const loadMyProfile = async () => {
    try {
      const res = await client.get(`/api/users/profile/${user.id}`);
      setProfileImageUrl(res.data?.profileImageUrl || "");
    } catch (error) {
      console.error("Error loading navbar profile image:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/chat" className="nav-link">Chat</Link>
          <Link to="/feed" className="nav-link">Feed</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>

        <div className="navbar-right">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="my profile" className="nav-avatar" />
          ) : (
            <div className="nav-avatar" />
          )}

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
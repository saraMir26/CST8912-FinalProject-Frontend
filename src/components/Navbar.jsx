import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";

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
    <nav
      style={{
        padding: "15px",
        borderBottom: "1px solid #ccc",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div>
        <Link to="/chat" style={{ marginRight: "15px" }}>Chat</Link>
        <Link to="/feed" style={{ marginRight: "15px" }}>Feed</Link>
        <Link to="/profile" style={{ marginRight: "15px" }}>Profile</Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="my profile"
            width="40"
            height="40"
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#ddd"
            }}
          />
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
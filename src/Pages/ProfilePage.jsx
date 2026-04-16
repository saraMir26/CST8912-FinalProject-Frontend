import { useState } from "react";
import client from "../api/client";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const handleSave = async () => {
    try {
      await client.post("/api/users/profile", {
        displayName,
        bio,
        profileImageUrl: ""
      });

      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      <h2>Profile Page</h2>

      <input
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <div style={{ marginTop: "10px" }}>
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleSave}>Save Profile</button>
      </div>
    </div>
  );
}
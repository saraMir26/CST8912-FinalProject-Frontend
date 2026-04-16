import { useEffect, useState } from "react";
import client from "../api/client";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/");
      return;
    }

    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await client.get(`/api/users/profile/${user.id}`);
      console.log("Profile response:", res.data);

      if (res.data && typeof res.data === "object") {
        setDisplayName(res.data.displayName || "");
        setBio(res.data.bio || "");
        setProfileImageUrl(res.data.profileImageUrl || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = profileImageUrl;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await client.post("/api/upload", formData);
        imageUrl = uploadRes.data.imageUrl;
      }

      await client.post("/api/users/profile", {
        displayName,
        bio,
        profileImageUrl: imageUrl
      });

      setProfileImageUrl(imageUrl);
      alert("Profile saved successfully!");
    } catch (error) {
        console.error("Error saving profile:", error);
        console.error("Save profile response:", error?.response?.data);
        alert(error?.response?.data?.message || "Failed to save profile");
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
        style={{ display: "block", marginBottom: "10px" }}
      />

      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "300px", height: "100px" }}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: "block", marginBottom: "10px" }}
      />

      {profileImageUrl && (
        <img
          src={profileImageUrl}
          alt="profile"
          width="150"
          style={{ display: "block", marginBottom: "10px" }}
        />
      )}

      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
}
import { useState } from "react";
import client from "../api/client";

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState(null);

  const handleSave = async () => {
    let profileImageUrl = "";

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await client.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      profileImageUrl = uploadRes.data.imageUrl;
    }

    await client.post("/api/users/profile", {
      displayName,
      bio,
      profileImageUrl
    });

    alert("Profile saved");
  };

  return (
    <div>
      <h2>Profile</h2>
      <input
        placeholder="Display name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
}
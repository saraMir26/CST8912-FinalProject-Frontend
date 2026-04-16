import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import Navbar from "../components/Navbar";

export default function UserProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const res = await client.get(`/api/users/profile/${id}`);
      setProfile(res.data || {});
    } catch (error) {
      console.error("Error loading user profile:", error);
      setProfile({});
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      <h2>User Profile</h2>

      {profile ? (
        <div>
          {profile.profileImageUrl && (
            <img
              src={profile.profileImageUrl}
              alt="profile"
              width="150"
              style={{ display: "block", marginBottom: "10px", borderRadius: "50%" }}
            />
          )}

          <h3>{profile.displayName || "No display name"}</h3>
          <p>{profile.bio || "No bio available."}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
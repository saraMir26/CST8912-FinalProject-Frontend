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
    <div className="page-shell">
      <Navbar />

      <h2>User Profile</h2>

      {profile ? (
        <div className="page-container">
        
          {profile.profileImageUrl && (
            <img
              src={profile.profileImageUrl}
              alt="profile"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "50%",
                display: "block",
                marginBottom: "20px"
              }}
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
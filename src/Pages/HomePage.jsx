import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import Navbar from "../components/Navbar";
import "../App.css";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadPosts();
    loadUsers();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await client.get("/api/posts");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await client.get("/api/users");

      if (Array.isArray(res.data)) {
        const filtered = res.data.filter(
          (u) => String(u.id) !== String(currentUser?.id)
        );
        setUsers(filtered);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div className="page-container">
        <div className="layout-grid">
          <aside className="sidebar">
            <h3>Users</h3>

            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="user-list-item"
                  onClick={() => navigate(`/user/${user.id}`)}
                >
                  {user.username}
                </div>
              ))
            ) : (
              <p className="muted">No users found.</p>
            )}
          </aside>

          <section className="feed-column">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="post-card">
                  <h4
                    className="post-author"
                    onClick={() => navigate(`/user/${post.userId}`)}
                  >
                    {post.username}
                  </h4>

                  <p>{post.caption}</p>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="post"
                      className="post-image"
                    />
                  )}

                  <div className="post-actions">
                    <small className="muted">{post.createdAt}</small>
                  </div>
                </div>
              ))
            ) : (
              <div className="card">
                <p className="muted">No posts yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
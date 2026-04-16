import { useEffect, useState } from "react";
import client from "../api/client";
import Navbar from "../components/Navbar";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  console.log("Current user in feed:", currentUser);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await client.get("/api/posts");
      console.log("GET /api/posts response:", res.data);

      if (Array.isArray(res.data)) {
        setPosts(res.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      console.error("Posts response:", error?.response?.data);
      setPosts([]);
    }
  };

  const createPost = async () => {
    try {
      setLoading(true);

      let imageUrl = "";

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await client.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        imageUrl = uploadRes.data.imageUrl;
      }

      await client.post("/api/posts", {
        caption,
        imageUrl
      });

      setCaption("");
      setFile(null);

      await loadPosts();
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      console.error("Create post response:", error?.response?.data);
      alert(error?.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      console.log("Deleting post:", postId);
      const res = await client.delete(`/api/posts/${postId}`);
      console.log("Delete response:", res.data);
      await loadPosts();
      alert("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      console.error("Delete post response:", error?.response?.data);
      alert(error?.response?.data?.message || "Failed to delete post");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      <h2>Feed Page</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Write a caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "block", marginBottom: "10px" }}
        />

        {file && <p>Selected file: {file.name}</p>}

        <button onClick={createPost} disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </div>

      <hr />

      <h3>All Posts</h3>

      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => {
          console.log("Post userId:", post.userId, "Current user id:", currentUser?.id);

          return (
            <div
              key={post.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px"
              }}
            >
              <h4>{post.username}</h4>
              <p>{post.caption}</p>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="post"
                  width="250"
                  style={{ display: "block", marginTop: "10px" }}
                />
              )}

              {String(post.userId) === String(currentUser?.id) && (
                <button
                  onClick={() => deletePost(post.id)}
                  style={{ marginTop: "10px" }}
                >
                  Delete Post
                </button>
              )}

              <div style={{ marginTop: "10px" }}>
                <small>{post.createdAt}</small>
              </div>
            </div>
          );
        })
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
}
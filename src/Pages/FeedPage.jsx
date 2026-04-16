import { useEffect, useState } from "react";
import client from "../api/client";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await client.get("/api/posts");
      console.log("Posts response:", res.data);

      if (Array.isArray(res.data)) {
        setPosts(res.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
    }
  };

  const createPost = async () => {
    try {
      await client.post("/api/posts", {
        caption,
        imageUrl: ""
      });

      setCaption("");
      loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Feed Page</h2>

      <input
        placeholder="Write a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button onClick={createPost}>Create Post</button>

      <div style={{ marginTop: "20px" }}>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id}>
              <h4>{post.username}</h4>
              <p>{post.caption}</p>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
}
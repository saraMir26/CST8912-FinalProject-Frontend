import { useEffect, useState } from "react";
import client from "../api/client";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const res = await client.get("/api/posts");
    setPosts(res.data);
  };

  const createPost = async () => {
    let imageUrl = "";

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await client.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      imageUrl = uploadRes.data.imageUrl;
    }

    await client.post("/api/posts", {
      caption,
      imageUrl
    });

    setCaption("");
    setFile(null);
    loadPosts();
  };

  return (
    <div>
      <h2>Feed</h2>

      <div>
        <input
          placeholder="Write a caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={createPost}>Create Post</button>
      </div>

      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h4>{post.username}</h4>
            <p>{post.caption}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="post" width="200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
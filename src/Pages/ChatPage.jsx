import { useEffect, useState } from "react";
import client from "../api/client";
import Navbar from "../components/Navbar";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await client.get("/api/chat");
      console.log("GET /api/chat response:", res.data);

      if (Array.isArray(res.data)) {
        setMessages(res.data);
      } else {
        console.error("Chat response is not an array:", res.data);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await client.post("/api/chat", {
        text,
        chatRoom: "general"
      });

      console.log("POST /api/chat response:", res.data);

      setText("");
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      <h2>Live Chat</h2>

      <div style={{ marginBottom: "20px" }}>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: "10px" }}>
              <strong>{msg.senderName}:</strong> {msg.text}
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
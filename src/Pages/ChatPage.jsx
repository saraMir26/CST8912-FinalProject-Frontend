import { useEffect, useState } from "react";
import client from "../api/client";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await client.get("/api/chat");
      console.log("Chat response:", res.data);

      if (Array.isArray(res.data)) {
        setMessages(res.data);
      } else {
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
      await client.post("/api/chat", {
        text,
        chatRoom: "general"
      });
      setText("");
      loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Live Chat</h2>

      <div>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id}>
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
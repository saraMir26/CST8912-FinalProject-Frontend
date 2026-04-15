import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    loadMessages();
    connectWebSocket();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await client.get("/api/chat");
      console.log("GET /api/chat response:", res.data);

      if (Array.isArray(res.data)) {
        setMessages(res.data);
      } else {
        console.error("Chat API did not return an array:", res.data);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    }
  };

  const connectWebSocket = async () => {
    try {
      const res = await client.get("/api/chat/negotiate");
      console.log("GET /api/chat/negotiate response:", res.data);

      if (!res.data || !res.data.url) {
        console.error("WebSocket URL missing:", res.data);
        return;
      }

      const ws = new WebSocket(res.data.url, "json.webpubsub.azure.v1");

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.data) {
            const message =
              typeof payload.data === "string"
                ? JSON.parse(payload.data)
                : payload.data;

            setMessages((prev) =>
              Array.isArray(prev) ? [...prev, message] : [message]
            );
          }
        } catch (err) {
          console.error("WebSocket message parse error:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    } catch (error) {
      console.error("Error connecting WebSocket:", error);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !user) return;

    try {
      await client.post("/api/chat", { text, chatRoom: "general" });
      setText("");
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
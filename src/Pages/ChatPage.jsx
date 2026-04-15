import { useEffect, useState } from "react";
import client from "../api/client";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();
    connectWebSocket();
  }, []);

  const loadMessages = async () => {
    const res = await client.get("/api/chat");
    setMessages(res.data);
  };

  const connectWebSocket = async () => {
    const res = await client.get("/api/chat/negotiate");
    const ws = new WebSocket(res.data.url, "json.webpubsub.azure.v1");

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.data) {
        const message = typeof payload.data === "string"
          ? JSON.parse(payload.data)
          : payload.data;

        setMessages((prev) => [...prev, message]);
      }
    };
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    await client.post("/api/chat", { text });
    setText("");
  };

  return (
    <div>
      <h2>Live Chat</h2>

      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.senderName}:</strong> {msg.text}
          </div>
        ))}
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
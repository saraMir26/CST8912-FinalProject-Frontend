import { useEffect, useState } from "react";
import client from "../api/client";
import Navbar from "../components/Navbar";

export default function ChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    console.log("Current user:", currentUser);
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages();
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const res = await client.get("/api/users");
      console.log("GET /api/users:", res.data);

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
      console.error("Users response:", error?.response?.data);
      setUsers([]);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await client.get(`/api/chat?userId=${selectedUser.id}`);
      console.log("GET /api/chat:", res.data);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading messages:", error);
      console.error("Messages response:", error?.response?.data);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    try {
      const res = await client.post("/api/chat", {
        text,
        receiverId: selectedUser.id
      });

      console.log("POST /api/chat:", res.data);

      setText("");
      await loadMessages();
    } catch (error) {
      console.error("Send message error:", error);
      console.error("Send response:", error?.response?.data);
      alert("Failed to send message");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ width: "250px", borderRight: "1px solid #ccc", paddingRight: "15px" }}>
          <h3>Users</h3>

          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor: selectedUser?.id === user.id ? "#eee" : "transparent",
                  borderRadius: "6px",
                  marginBottom: "8px"
                }}
              >
                {user.username}
              </div>
            ))
          ) : (
            <p>No other users found.</p>
          )}
        </div>

        <div style={{ flex: 1 }}>
          {selectedUser ? (
            <>
              <h3>Chat with {selectedUser.username}</h3>

              <div
                style={{
                  minHeight: "300px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px"
                }}
              >
                {messages.length > 0 ? (
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
                style={{ marginRight: "10px", width: "300px" }}
              />
              <button onClick={sendMessage}>Send</button>
            </>
          ) : (
            <p>Select a user to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
}
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
      setUsers(res.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await client.get(`/api/chat?userId=${selectedUser.id}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    try {
      await client.post("/api/chat", {
        text,
        receiverId: selectedUser.id
      });

      setText("");
      loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Navbar />

      {/* LEFT SIDE USERS */}
      <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "10px" }}>
        <h3>Users</h3>

        {users
          .filter((u) => u.id !== currentUser.id)
          .map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                padding: "10px",
                cursor: "pointer",
                background: selectedUser?.id === user.id ? "#eee" : "transparent"
              }}
            >
              {user.username}
            </div>
          ))}
      </div>

      {/* RIGHT SIDE CHAT */}
      <div style={{ flex: 1, padding: "20px" }}>
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.username}</h3>

            <div style={{ height: "300px", overflowY: "auto", marginBottom: "10px" }}>
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
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}
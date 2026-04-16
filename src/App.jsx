import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ChatPage from "./Pages/ChatPage";
import ProfilePage from "./Pages/ProfilePage";
import FeedPage from "./Pages/FeedPage";
import UserProfilePage from "./Pages/UserProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/user/:id" element={<UserProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
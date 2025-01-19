import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import ChatPage from "./chat/ChatPage";
import ContactsPage from "./contacts/ContactsPage";
import Register from "./register/Register"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contacts" element={<ContactsPage />} />
        {/* <Route path="/chat/:contactId" element={<ChatPage />} /> */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;

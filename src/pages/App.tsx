import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import Register from "./register/Register";
import ContactsPage from "./contacts/ContactsPage";
import ChatPage from "./chat/ChatPage";
import UserSettings from "./profile/UserSettings";
import PublicRoute from "../components/routes/PublicRoute";
import PrivateRoute from "../components/routes/PrivateRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        <Route path="/contacts" element={
          <PrivateRoute>
            <ContactsPage />
          </PrivateRoute>
        } />

        <Route path="/chat/:id" element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        } />

        <Route path="/settings" element={
          <PrivateRoute>
            <UserSettings />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import ChatPage from "./chat/ChatPage";
import ContactsPage from "./contacts/ContactsPage";
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
          </Routes>
      </Router>
    );
  };

export default App;

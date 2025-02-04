import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import Register from "./register/Register";
import ContactsPage from "./contacts/ContactsPage";
import ChatPage from "./chat/ChatPage";
import DesktopPage from "./desktop/DesktopPage";
import UserSettings from "./profile/UserSettings";
import PublicRoute from "../components/routes/PublicRoute";
import PrivateRoute from "../components/routes/PrivateRoute";

const App: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 769px)");

    const handleResize = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

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

        {/* En desktop, siempre se renderiza DesktopPage */}
        {isDesktop ? (
          <Route path="*" element={
            <PrivateRoute>
              <DesktopPage />
            </PrivateRoute>
          } />
        ) : (
          <>
          <Route path="/contacts" element={
            <PrivateRoute>
              <ContactsPage />
            </PrivateRoute>
          }/>

          <Route path="/chat/:userId" element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          } />

          <Route path="/settings" element={
            <PrivateRoute>
              <UserSettings />
            </PrivateRoute>
          }/>
         </>
        )} 
      </Routes>
    </Router>
  );
};

export default App;
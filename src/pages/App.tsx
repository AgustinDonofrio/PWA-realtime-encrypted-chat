import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./login/Login";
import Register from "./register/Register";
import ContactsPage from "./contacts/ContactsPage";
import ChatPage from "./chat/ChatPage";
import DesktopPage from "./desktop/DesktopPage";
import UserSettings from "./profile/UserSettings";
import PublicRoute from "../components/routes/PublicRoute";
import PrivateRoute from "../components/routes/PrivateRoute";
import PushNotification from "../components/notification/PushNotification.tsx";
import { onMessageListener, requestPermission } from "../controllers/pushNotificationController";
import { auth } from "../firebase/firebase.config.ts";

const App: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [deployNotification, setDeployNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: "", message: "", isFile: false, icon: "" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        requestPermission();

        onMessageListener((payload) => {

          // La notificación solo se despliega si el usuario no está en la conversación
          if (selectedId != payload.data.senderId) {
            setNotificationData({
              title: payload.notification.title,
              message: payload.notification.body,
              isFile: payload.data.isFileMessage == "1",
              icon: payload.data.icon,
            });

            setDeployNotification(true);
            setTimeout(() => {
              setDeployNotification(false);
            }, 5000);
          }
        });
      }
    });

    return () => unsubscribe();
  }, [selectedId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 769px)");

    const handleResize = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleContactClick = (contactId: string) => {
    console.log("Contacto seleccionado:", contactId);

    setSelectedId(contactId);
  }

  return (
    <>
      {deployNotification && (
        <PushNotification title={notificationData.title} message={notificationData.message} isFile={notificationData.isFile}></PushNotification>
      )}

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
                <DesktopPage callback={handleContactClick} />
                <Navigate to="/contacts" replace />
              </PrivateRoute>
            } />
          ) : (
            <>
              <Route path="/contacts" element={
                <PrivateRoute>
                  <ContactsPage callback={handleContactClick} />
                </PrivateRoute>
              } />

              <Route path="/chat/:userId" element={
                <PrivateRoute>
                  <ChatPage callback={handleContactClick} />
                </PrivateRoute>
              } />

              <Route path="/settings" element={
                <PrivateRoute>
                  <UserSettings />
                </PrivateRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
};

export default App;
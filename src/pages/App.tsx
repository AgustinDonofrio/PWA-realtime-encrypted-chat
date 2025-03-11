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
import { title } from "process";

const App: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [notifications, setNotifications] = useState<{ [key: string]: number }>({});
  const [deployNotification, setDeployNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({ title: "", message: "" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        requestPermission();

        onMessageListener((payload: { data: { senderId: string }, notification: { title: string, body: string } }) => {
          console.log(payload);
          const senderId = payload.data.senderId;

          if (selectedId !== senderId) {
            setNotifications((prev) => {
              const updatedNotifications = { ...prev, [senderId]: (prev[senderId] || 0) + 1 };

              // Actualizamos el mensaje según la cantidad de notificaciones
              const totalMessages = Object.values(updatedNotifications).reduce((a, b) => a + b, 0);

              if (Object.keys(updatedNotifications).length === 1) {
                const userMessages = updatedNotifications[senderId];

                setNotificationMessage({ title: payload.notification.title, message: payload.notification.body });

              } else {
                setNotificationMessage({ title: "BlueCrypt notification", message: `You have ${totalMessages} new messages` });
              }

              return updatedNotifications;
            });

            setDeployNotification(true);
            setTimeout(() => {
              setDeployNotification(false);
              setNotifications({}); // Limpiar notificaciones después de mostrarlas
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
        <PushNotification title={notificationMessage.title} message={notificationMessage.message} />
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
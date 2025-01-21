import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot, orderBy, getDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase.config";

import Header from "../../components/header/Header";
import MessageBubble from "../../components/chat/MessageBubble";
import InputBar from "../../components/chat/InputBar";
import { getUserById } from "../../controllers/userController";

const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Obtener el ID del usuario desde la URL
  const currentUser = auth.currentUser?.uid;
  const [messages, setMessages] = useState<
    { text: string; isSender: boolean }[]
  >([]);
  const [chatUser, setChatUser] = useState<{ name: string; imageUrl: string }>({
    name: "",
    imageUrl: "",
  });

  // Obtener los datos del usuario con el que se está chateando
  useEffect(() => {
    if (!userId) return;

    const fetchChatUser = async () => {
      try {
        const userData: any = await getUserById(userId);
        if (userData) {
          setChatUser({
            name: userData.name || "Unknown User",
            imageUrl: userData.profilePicture || "",
          });
        }
      } catch (error) {
        console.error("Error fetching chat user:", error);
      }
    };

    fetchChatUser();
  }, [userId]);

  // Obtener mensajes en tiempo real
  useEffect(() => {
    if (!currentUser || !userId) return;

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("to", "in", [currentUser, userId]),
      where("from", "in", [currentUser, userId]),
      orderBy("creationDate", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          text: data.text,
          isSender: data.from === currentUser, // Verificar si el mensaje fue enviado por el usuario actual
        };
      });

      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [currentUser, userId]);

  const handleSendMessage = (message: string) => {
    // Implementar lógica para enviar mensajes a Firebase ...
    setMessages([...messages, { text: message, isSender: true }]);
  };

  return (
    <div className="h-screen w-full mx-auto bg-main-color text-white flex flex-col relative shadow-lg">
      {/* Header */}
      <Header
        title={chatUser.name}
        leftButton="back"
        rightButton="profile"
        profileImageUrl={chatUser.imageUrl || undefined} // Mostrar imagen del usuario o un ícono por defecto
      />

      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} isSender={msg.isSender} />
        ))}
      </div>

      {/* Barra de entrada */}
      <InputBar onSend={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
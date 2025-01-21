import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import MessageBubble from "../../components/chat/MessageBubble";
import InputBar from "../../components/chat/InputBar";
import { getUserById } from "../../controllers/userController";
import { subscribeToMessages, sendMessage } from "../../controllers/messageController";

const ChatPage: React.FC = () => {
  const { userId } = useParams();
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
    if (!userId) return;

    const unsubscribe = subscribeToMessages(userId, (newMessages) => {
      setMessages(newMessages); // Actualizar el estado con los nuevos mensajes
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userId]);

  const handleSendMessage = async (message: string) => {
    if (userId) {
      await sendMessage(userId, message)
    }

    setMessages([...messages, { text: message, isSender: true }]);
  };

  return (
    <div className="h-screen w-full mx-auto bg-main-color text-white flex flex-col relative shadow-lg">

      <Header
        title={chatUser.name}
        leftButton="back"
        rightButton="profile"
        profileImageUrl={chatUser.imageUrl || undefined} // Mostrar imagen del usuario o un ícono por defecto
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} isSender={msg.isSender} />
        ))}
      </div>
      <InputBar onSend={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
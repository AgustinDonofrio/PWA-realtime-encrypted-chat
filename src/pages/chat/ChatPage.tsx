import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import MessageBubble from "../../components/chat/MessageBubble";
import InputBar from "../../components/chat/InputBar";
import { getUserById } from "../../controllers/userController";
import { subscribeToMessages, sendMessage } from "../../controllers/messageController";
import LoadingPage from "../loading/LoadingPage";
import { formatDate } from "../../helpers/utils";

const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
  <div className="text-gray-400 text-sm text-center my-2">
    {date}
  </div>
);

const ChatPage: React.FC = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState<{ text?: string; imageUrl?: string; isSender: boolean, timestamp:Date }[]>([]);
  const [chatUser, setChatUser] = useState<{ name: string; imageUrl: string }>({
    name: "",
    imageUrl: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null); //Para scroll automático
  const [hasLoaded, setHasLoaded] = useState(false); // Para controlar animación inicial
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatUser();
  }, [userId]);

  // Obtener mensajes en tiempo real
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToMessages(userId, (newMessages) => {
      setMessages(newMessages); // Actualizar los mensajes
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [userId]);

  // Hacer scroll cada vez que cambian los mensajes
  useLayoutEffect(() => {
    if (!hasLoaded) {
      scrollToBottom();
      setHasLoaded(true);
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
    }
  }, [messages]); // Este hook se dispara cuando los mensajes cambia

  // Scroll automático al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const handleSendMessage = async (message: string, imageUrl?: string) => {
    if (userId) {
      await sendMessage(userId, message, imageUrl);
    }

    setMessages([...messages, { text: message, imageUrl, isSender: true, timestamp: new Date() }]);
    scrollToBottom(); // Hacer scroll al final después de enviar un mensaje
  };

  // Función para agrupar mensajes por fecha
  const groupedMessages = messages.reduce((groups: Record<string, any[]>, msg) => {
    const date = formatDate(msg.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
    return groups;
  }, {});

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="h-screen w-full mx-auto bg-main-color flex flex-col relative shadow-lg">
      {/* Header */}
      <Header
        title={chatUser.name}
        leftButton="back"
        rightButton="profile"
        profileImageUrl={chatUser.imageUrl || undefined} // Mostrar imagen del usuario o un ícono por defecto
      />

      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            {/* Fecha como separador */}
            <DateSeparator date={date} />
            {messages.map((msg, index) => (
              <MessageBubble 
                key={index} 
                text={msg.text} 
                imageUrl={msg.imageUrl}
                isSender={msg.isSender} 
                timestamp={msg.timestamp}
              />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Para asegurar el scroll al final */}
      </div>

       {/* Barra del input */}
      <InputBar onSend={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
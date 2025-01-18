import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageBubble from "../../components/chat/MessageBubble";
import InputBar from "../../components/chat/InputBar";
import { db, auth } from "../../firebase/firebase.config";

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<{
    text: string;
    isSender: boolean;
  }[]>([
    { text: "Hola, cómo va eso?", isSender: false },
    { text: "Todo bien y vos??", isSender: true },
  ]);

  useEffect(() => {
    // Referencia a la colección "messages"
    const messagesRef = collection(db, "messages");

    // Consulta para obtener mensajes relevantes
    const q = query(
      messagesRef,
      where("to", "==", "zIDKZRQQtmQuttBmXv94"), // Mensajes dirigidos al usuario actual
      where("from", "==", "aQjdSFc94VzIdfAGQVLh"), // Emitidos por el usuario conectado al chat
      orderBy("creationDate", "asc") // Ordenar por timestamp
    );

    // Escuchar en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          text: data.text,
          isSender: data.senderId === "zIDKZRQQtmQuttBmXv94", // Si el mensaje es del usuario actual, marcarlo como "enviado"
        };
      });

      setMessages(newMessages);
    });

    // Cleanup del listener
    return () => unsubscribe();
  }, ["zIDKZRQQtmQuttBmXv94", "aQjdSFc94VzIdfAGQVLh"]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { text: message, isSender: true }]);
  };

  return (
    <div
      className="h-screen w-full mx-auto bg-main-color text-white flex flex-col relative shadow-lg"
    >
      {/* Header */}
      <ChatHeader name="Ethan Johnson" image="Ethan.jpg" />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} isSender={msg.isSender} />
        ))}
      </div>

      {/* Input Bar */}
      <InputBar onSend={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
import React, { useState } from "react";

import ChatHeader from "../../components/chat/ChatHeader";
import MessageBubble from "../../components/chat/MessageBubble";
import InputBar from "../../components/chat/InputBar";

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<{
    text: string;
    isSender: boolean;
  }[]>([
    { text: "Hola, cómo va eso?", isSender: false },
    { text: "Todo bien y vos??", isSender: true },
  ]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { text: message, isSender: true }]);
  };

  return (
    <div
      className="h-screen max-w-[390px] mx-auto bg-main-color text-white flex flex-col relative shadow-lg"
      style={{ height: "844px" }}
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
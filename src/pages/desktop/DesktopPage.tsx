import React, { useState } from "react";
import Header from "../../components/header/Header";
import ContactList from "../../components/contacts/ContactList";
import MessageBubble from "../../components/chat/MessageBubble";
import InputBar from "../../components/chat/InputBar";
import { useNavigate } from "react-router-dom";
import ContactsPage from "../contacts/ContactsPage";

const DesktopChatView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ text?: string; imageUrl?: File; isSender: boolean; timestamp: Date }>>([]);

  // Datos de ejemplo para la lista de contactos
  const contacts = [
    { id: "1", name: "Ava Martinez", email: "ava@example.com", status: "Hey, I'm using WhatsApp", profilePicture: "", isAgended: true },
    { id: "2", name: "Ethan Johnson", email: "ethan@example.com", status: "I'm a designer", profilePicture: "", isAgended: true },
    { id: "3", name: "Liam Davis", email: "liam@example.com", status: "I'm a professional chef", profilePicture: "", isAgended: true },
  ];

  // const handleSendMessage = (message: string, imageUrl?: File) => {
  //   setMessages([...messages, { text: message, imageUrl, isSender: true, timestamp: new Date() }]);
  // };

  const handleAddContact = (id: string) => {
    console.log("Adding contact with id:", id);
    // Lógica para agregar contacto
  };

  const handleSearch = (text: string) => {
    console.log("Searching for:", text);
    // Lógica para buscar contactos
  };

  // const handleSendMessage = async (message: string, imageFile?: File) => {
  //   let imageUrl = "";
  //   if (userId) {
  //     if (imageFile) {
  //       setLoadingImgUpload(true);

  //       const imgResult = await uploadToCloudinary(imageFile);

  //       if (imgResult) {
  //         imageUrl = imgResult;
  //       }
  //       setLoadingImgUpload(false);
  //     }

  //     if (imageFile && imageUrl.length == 0) {
  //       showSnackbar("We have problems to upload the selected image, please try again", "error");
  //       return;
  //     }

  //     await sendMessage(userId, message, imageUrl);
  //   }
  // };

  return (
    <div className="flex h-full">
      {/* Sidebar para la lista de contactos */}
      <div className="w-1/4 bg-main-color overflow-y-auto border-r-2 border-gray-700">
        {/* <Header title="Chats" rightButton="settings" /> */}
        <ContactsPage />
      </div>

      {/* Ventana de chat */}
      <div className="w-3/4 bg-main-color flex flex-col">
        {/* Header del chat */}
        {selectedContact && (
          <div className="text-white p-4">
            <h2 className="text-lg font-semibold">{selectedContact}</h2>
            <p className="text-sm text-gray-500">Last seen Dec 12, 2022</p>
          </div>
        )}

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              text={message.text}
              // imageUrl={message.imageUrl}
              isSender={message.isSender}
              timestamp={message.timestamp}
            />
          ))}
        </div>

        {/* Input para enviar mensajes */}
        {/* <InputBar onSend={handleSendMessage} /> */}
      </div>
    </div>
  );
};

export default DesktopChatView;
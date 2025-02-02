import React, { useState } from "react";
import { CiLock } from "react-icons/ci";
import ContactsPage from "../contacts/ContactsPage";
import ChatPage from "../chat/ChatPage";

const DesktopPage: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const handleContactClick = (contactId: string) => {
    setSelectedContact(contactId); // Actualizar el contacto seleccionado
  };

  return (
    <div className="flex h-full bg-main-color">
      {/* Sidebar para la lista de contactos */}
      <div className="w-1/3 overflow-y-auto border-r-2 border-gray-700">
          <ContactsPage onContactClick={handleContactClick} />
      </div>

      {/* Ventana de chat */}
      <div className="w-full bg-main-color flex flex-col">
        {selectedContact ? (
          <ChatPage userId={selectedContact} />
        ) : (
          <div className="text-main-gray flex items-center justify-center h-full">
            <p className="text-2xl">Welcome to BlueCrypt!</p>
            <CiLock className="text-gray-500" /> <span className="justify-center text-sm"> Your personal messages are end-to-end encrypted.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopPage;
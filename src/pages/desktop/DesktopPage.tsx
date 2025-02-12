import React, { useState } from "react";
import { CiLock } from "react-icons/ci";
import ContactsPage from "../contacts/ContactsPage";
import ChatPage from "../chat/ChatPage";
import UserSettings from "../profile/UserSettings";

const DesktopPage: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false); // Estado para alternar entre contactos y configuraciones

  const handleContactClick = (contactId: string) => {
    setSelectedContact(contactId); // Actualizar el contacto seleccionado
  };

  const handleSettingsClick = () => {
    setShowSettings((prev) => !prev); // Alternar entre mostrar y ocultar UserSettings.tsx
  };

  return (
    <div className="flex h-full bg-main-color">
      {/* Sidebar para la lista de contactos o UserSettings */}
      <div className="w-1/3 overflow-y-auto border-r-2 border-gray-700">
        {showSettings ? (
          <UserSettings onMessageClick={() => setShowSettings(false)} />
        ) : (
          <ContactsPage onContactClick={handleContactClick} onSettingsClick={handleSettingsClick} />
        )}
      </div>

      {/* Ventana de chat */}
      <div className="w-full bg-main-color flex flex-col items-center justify-center relative">
        {selectedContact ? (
          <ChatPage userId={selectedContact} />
        ) : (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl text-gray-300 font-semibold">
              Welcome to <span className="text-blue-500">BlueCrypt </span>!
            </h1>
            <p className="text-lg text-gray-400 mt-2 max-w-md">
              Start a new chat or add contacts to begin messaging.
            </p>
            <div className="absolute bottom-5 flex items-center text-sm text-gray-500">
              <CiLock className="text-gray-500 mr-1" /> 
              <span className="justify-center text-sm"> Your personal messages are end-to-end encrypted.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopPage;
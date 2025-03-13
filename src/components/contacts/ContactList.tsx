import React, { useState } from "react";
import ContactCard from "./ContactCard";
import SearchBar from "../search_bar/SearchBar";

interface Contact {
  name: string | "";
  status: string | "";
  profilePicture: string | "";
  email: string | "";
  id: string;
  lastMessage?: string;
  isFile?: boolean;
  isAgended?: boolean;
}

interface ContactListProps {
  contacts: Contact[];
  addingContacts: string[];
  unreadCounts: { [contactId: string]: number };
  onAddContact: (id: string) => void; // Función para manejar la acción de añadir contactos
  onSearch: (text: string) => void; // Función para manejar la búsqueda de contactos
  withoutContactAction: () => void;
  onContactClick: (contactId: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  addingContacts,
  unreadCounts = {},
  onAddContact,
  withoutContactAction,
  onSearch,
  onContactClick
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const hasContacts = contacts.length > 0;

  const handleSearch = (text: string) => {
    setIsSearching(text.length > 0); // Activar modo "búsqueda" sólo si hay texto
    onSearch(text);
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
      {!hasContacts && !isSearching ? (
        <div className="flex h-full flex-col items-center justify-center text-white text-center">
          <img
            src="/images/no-contacts.png"
            alt="No contacts"
            className="w-52 h-44 mb-4 -mt-10"
          />
          <p className="mb-5">You have not contacts. Let's add some!</p>
          <button
            onClick={withoutContactAction}
            className="bg-royal-blue text-white py-2 px-6 rounded-full hover:bg-blue-500 transition-colors"
          >
            Add a New Contact
          </button>
        </div>
      ) : (
        <>
          <SearchBar onSearch={handleSearch} />
          {hasContacts ? (
            contacts.map((contact, index) => (
              <ContactCard
                key={index}
                name={contact.name}
                email={contact.email}
                status={contact.status}
                profilePicture={contact.profilePicture}
                id={contact.id}
                lastMessage={contact.lastMessage}
                isFile={contact.isFile}
                isAgended={contact.isAgended}
                isAdding={addingContacts.includes(contact.id)}
                unreadCount={unreadCounts[contact.id] || 0}
                onAddContact={onAddContact}
                onClick={onContactClick}
              />
            ))
          ) : (
            // Mensaje para búsqueda sin resultados
            <div className="flex items-center justify-center text-white text-center">
              <p>No contacts match your search.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContactList;
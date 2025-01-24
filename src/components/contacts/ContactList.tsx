import React, { useState } from "react";
import ContactCard from "./ContactCard";
import SearchBar from "./SearchBar";

interface Contact {
  name: string | ""; status: string | ""; profilePicture: string | ""; email: string | ""; id: string;
}

interface ContactListProps {
  contacts: Contact[];
  onAddContact: () => void; // Función para manejar la acción de añadir contactos
  onSearch: (text: string) => void; // Función para manejar la búsqueda de contactos
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onAddContact, onSearch }) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (text: string) => {
    setIsSearching(text.length > 0); // Activar modo "búsqueda" sólo si hay texto
    onSearch(text);
  };

  const hasContacts = contacts.length > 0;

  return (
    <div className="flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
      {!hasContacts && !isSearching ? (
        <div className="flex flex-col  h-full items-center justify-center text-white text-center">
          <img
            src="/images/no-contacts.png"
            alt="No contacts"
            className="w-52 h-44 mb-4 -mt-10"
          />
          <p className="mb-5">You have not contacts. Let's add some!</p>
          <button
            onClick={onAddContact}
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
                status={contact.status}
                image={contact.profilePicture}
                id={contact.id}
              />
            ))
          ) : (
            // Mensaje para búsqueda sin resultados
            <div className="flex h-full items-center justify-center text-white text-center">
              <p>No contacts match your search.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContactList;
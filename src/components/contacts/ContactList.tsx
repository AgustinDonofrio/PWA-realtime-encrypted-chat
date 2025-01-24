import React, { useState, useEffect } from "react";
import { getUserById } from "../../controllers/userController";
import ContactCard from "./ContactCard";
import SearchBar from "./SearchBar";
import Spinner from "../spinner/Spinner";

interface Contact {
  name: string | ""; status: string | ""; profilePicture: string | ""; id: string;
}

interface ContactListProps {
  contacts: Contact[];
  onAddContact: () => void; // Función para manejar la acción de añadir contactos
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onAddContact }) => {

  return (
    <div className="overflow-y-auto flex-1">
      {contacts?.length === 0 ? (
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
          <SearchBar />
          {contacts.map((contact, index) => (
            <ContactCard
              key={index}
              name={contact.name}
              status={contact.status}
              image={contact.profilePicture}
              id={contact.id}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ContactList;
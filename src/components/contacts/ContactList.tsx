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
}

const ContactList: React.FC<ContactListProps> = ({ contacts }) => {

  return (
    <div className="overflow-y-auto flex-1">
      {contacts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-white text-center">
          <img
            src="/images/no-contacts.png"
            alt="No contacts"
            className="w-52 h-44 mb-4 mt-4"
          />
          <p>You have not contacts. Let's add some!</p>
        </div>
      ) : (
        <>
          {contacts.length >= 0 && <SearchBar />}
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
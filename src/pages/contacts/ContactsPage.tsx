import React from "react";

import Header from "../../components/header/Header";
import ContactList from "../../components/contacts/ContactList";

const ContactsPage: React.FC = () => {
  return (
    <div
      className="h-screen w-full mx-auto bg-main-color flex flex-col relative shadow-lg"
    >
       <Header
        title="WEB APP"
        rightButton="settings"
      />
      <ContactList />
      <button
        className="absolute bottom-6 right-6 bg-royal-blue w-14 h-14 rounded-full flex items-center justify-center shadow-md"
        aria-label="Add Contact"
      >
        <span className="relative block w-4 h-4">
          <span className="absolute bg-white w-full h-[2px] top-1/2 left-0 -translate-y-1/2"></span>
          <span className="absolute bg-white h-full w-[2px] left-1/2 top-0 -translate-x-1/2"></span>
        </span>
      </button>
    </div>
  );
};

export default ContactsPage;
import React, { useState } from "react";
import Header from "../../components/header/Header";
import ContactList from "../../components/contacts/ContactList";
import AddContactModal from "../../components/modal/AddContactModal";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";

const ContactsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const userDocId = "aQjdSFc94VzIdfAGQVLh"; // ID del usuario principal

  const handleAddContact = async (contactId: string) => {
    try {
      const userDocRef = doc(db, "users", userDocId);

      await updateDoc(userDocRef, {
        contacts: arrayUnion(contactId),
      });

      alert("Contact added successfully!");
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("Failed to add contact.");
    }
  };

  return (
    <div className="h-screen w-full mx-auto bg-main-color flex flex-col relative shadow-lg">
      <Header 
        title="WEB APP" 
        rightButton="settings" 
      />
      <ContactList />
      <button
        onClick={() => setShowModal(true)}
        className="absolute bottom-6 right-6 bg-royal-blue w-14 h-14 rounded-full flex items-center justify-center shadow-md"
        aria-label="Add Contact"
      >
        <span className="relative block w-4 h-4">
          <span className="absolute bg-white w-full h-[2px] top-1/2 left-0 -translate-y-1/2"></span>
          <span className="absolute bg-white h-full w-[2px] left-1/2 top-0 -translate-x-1/2"></span>
        </span>
      </button>
      {showModal && (
        <AddContactModal
          onClose={() => setShowModal(false)}
          onAddContact={handleAddContact}
        />
      )}
    </div>
  );
};

export default ContactsPage;
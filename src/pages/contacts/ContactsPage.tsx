import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import ContactList from "../../components/contacts/ContactList";
import AddContactModal from "../../components/modal/AddContactModal";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { getUserByEmail, getLoggedEmail } from "../../controllers/userController";
import Spinner from "../../components/spinner/Spinner";

const ContactsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState<
    { name: string; status: string; profilePicture: string; id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);


  // ID del documento del usuario principal
  const userDocId = "tOdmKCe4wsfasJqqdPHFV3xaF6I2";

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const loggedEmail = getLoggedEmail();

      if (!loggedEmail) {
        console.error("No authenticate");
        setLoading(false);
        return;
      }

      const userData = await getUserByEmail(loggedEmail);

      if (userData == null) {
        console.error("Usuario not found");
        setLoading(false);
        return;
      }

      const contacts: { [key: string]: { name: string; status: string; profilePicture: string } } = (userData.data && 'contacts' in userData.data) ? userData.data.contacts : {};


      if (Object.keys(contacts).length > 0) {
        const contactsData: { name: string; status: string; profilePicture: string; id: string }[] = [];
        for (const [key, value] of Object.entries(contacts)) {
          contactsData.push({ name: value?.name || "", status: value?.status || "", profilePicture: value?.profilePicture || "", id: key });
        }

        setContacts(contactsData);
      }

    } catch (error) {
      console.error("Error obteniendo contactos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

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
        title="BlueCrypt"
        rightButton="settings"
      />
      {loading ? (<Spinner />) : (<><ContactList contacts={contacts} onAddContact={() => setShowModal(true)} />
        {contacts.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            className="absolute bottom-6 right-6 bg-royal-blue w-14 h-14 rounded-full flex items-center justify-center shadow-md"
            aria-label="Add Contact"
          >
            {/* Simula el "+" del botón */}
            <span className="relative block w-4 h-4">
              <span className="absolute bg-white w-full h-[2px] top-1/2 left-0 -translate-y-1/2"></span>
              <span className="absolute bg-white h-full w-[2px] left-1/2 top-0 -translate-x-1/2"></span>
            </span>
          </button>
        )}
        {showModal && (
          <AddContactModal
            onClose={() => setShowModal(false)}
            reloadContactList={fetchContacts}
          />
        )}</>)}

    </div>
  );
};

export default ContactsPage;
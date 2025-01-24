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
    { name: string; status: string; profilePicture: string; email: string; id: string }[]
  >([]);
  const [filteredContacts, setFilteredContacts] = useState<
    { name: string; status: string; profilePicture: string; email: string; id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");


  // ID del documento del usuario principal
  const userDocId = "tOdmKCe4wsfasJqqdPHFV3xaF6I2";

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const loggedEmail = getLoggedEmail();

      if (!loggedEmail) {
        console.error("No authenticated user");
        setLoading(false);
        return;
      }

      const userData = await getUserByEmail(loggedEmail);

      if (!userData) {
        console.error("User not found");
        setLoading(false);
        return;
      }

      const contacts: { [key: string]: { name: string; status: string; profilePicture: string; email: string} } = 
        (userData.data && "contacts" in userData.data) ? userData.data.contacts : {};

      if (Object.keys(contacts).length > 0) {
        const contactsData = Object.entries(contacts).map(([key, value]) => ({
          name: value?.name || "",
          status: value?.status || "",
          profilePicture: value?.profilePicture || "",
          email: value?.email || "",
          id: key,
        }));
        setContacts(contactsData);
        setFilteredContacts(contactsData); // Inicialización de los contactos filtrados
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

  // Filtrar contactos cuando cambia el texto de búsqueda
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredContacts(contacts);
      return;
    }
  
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchText, contacts]);

  return (
    <div className="h-screen w-full mx-auto bg-main-color flex flex-col relative shadow-lg">
      <Header
        title="BlueCrypt"
        rightButton="settings"
      />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <ContactList 
            contacts={filteredContacts} 
            onAddContact={() => setShowModal(true)} 
            onSearch={(text) => setSearchText(text)}
          />
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
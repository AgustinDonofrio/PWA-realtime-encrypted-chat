import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import ContactList from "../../components/contacts/ContactList";
import AddContactModal from "../../components/modal/AddContactModal";
import { db } from "../../firebase/firebase.config";
import { getUserByEmail, getLoggedEmail } from "../../controllers/userController";
import { getLastMessage } from "../../controllers/messageController";
import Spinner from "../../components/spinner/Spinner";

const ContactsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState<
    { name: string; status: string; profilePicture: string; email: string; lastMessage: string, isFile: boolean; id: string }[]
  >([]);
  const [filteredContacts, setFilteredContacts] = useState<
    { name: string; status: string; profilePicture: string; email: string; id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

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

      const contacts: { [key: string]: { name: string; status: string; profilePicture: string; email: string; lastMessage: string, isFile: boolean} } = 
        (userData.data && "contacts" in userData.data) ? userData.data.contacts : {};

      const contactsData = await Promise.all(
        Object.entries(contacts).map(async ([key, value]) => {
          const lastMessage = await getLastMessage(key);
          return {
            id: key,
            name: value.name || "",
            status: value.status || "",
            profilePicture: value.profilePicture || "",
            email: value.email || "",
            lastMessage: lastMessage?.text || "", // Texto del último mensaje
            isFile: lastMessage?.isFile || false, // Si el último mensaje es un archivo
          };
        })
      );

      setContacts(contactsData);
      setFilteredContacts(contactsData);
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
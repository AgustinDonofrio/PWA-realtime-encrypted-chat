import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import ContactList from "../../components/contacts/ContactList";
import AddContactModal from "../../components/modal/AddContactModal";
import { db, auth } from "../../firebase/firebase.config";
import { getUserByEmail, getLoggedEmail, getUserById, addContactToUser } from "../../controllers/userController";
import { getLastMessage, getMessagesByUser } from "../../controllers/messageController";
import Spinner from "../../components/spinner/Spinner";

const ContactsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState<
    { name: string; email: string; status: string; profilePicture: string; id: string; lastMessage: string, isFile: boolean, isAgended?: boolean }[]
  >([]);
  const [filteredContacts, setFilteredContacts] = useState<
    { name: string; email: string; status: string; profilePicture: string; id: string }[]
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

      // Verificar si el usuario está autenticado
      if (!auth.currentUser?.uid) {
        console.error("User is not authenticated");
        setLoading(false);
        return;
      }

      // Obtener contactos agendados
      const agendedContacts: { [key: string]: { name: string; status: string; profilePicture: string; email: string } } =
        (userData.data && "contacts" in userData.data) ? userData.data.contacts : {};

      // Obtener todos los mensajes del usuario actual
      const messages = await getMessagesByUser(auth.currentUser.uid); // Aquí ya sabemos que uid es un string

      // Extraer IDs de usuarios con los que se ha intercambiado mensajes
      const messageUserIds = new Set<string>();
      messages.forEach((message) => {
        if (message.from !== auth.currentUser?.uid) {
          messageUserIds.add(message.from);
        }
        if (message.to !== auth.currentUser?.uid) {
          messageUserIds.add(message.to);
        }
      });

      // Combinar contactos agendados y no agendados
      const contactsData = await Promise.all(
        Array.from(messageUserIds).map(async (userId) => {
          const isAgended = agendedContacts[userId] !== undefined;
          const lastMessage = await getLastMessage(userId);

          // Si el contacto está agendado, usar sus datos
          if (isAgended) {
            return {
              id: userId,
              name: agendedContacts[userId].name || "",
              status: agendedContacts[userId].status || "",
              profilePicture: agendedContacts[userId].profilePicture || "",
              email: agendedContacts[userId].email || "",
              lastMessage: lastMessage?.text || "",
              isFile: lastMessage?.isFile || false,
              isAgended: true,
            };
          } else {
            // Si el contacto no está agendado, obtener sus datos básicos
            const userDoc = await getUserById(userId);
            return {
              id: userId,
              name: userDoc?.name || "Unknown",
              status: userDoc?.status || "",
              profilePicture: userDoc?.profilePicture || "",
              email: userDoc?.email || "",
              lastMessage: lastMessage?.text || "",
              isFile: lastMessage?.isFile || false,
              isAgended: false,
            };
          }
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

  const handleAddContact = async (contactId: string) => {
    try {
      const userToAdd = await getUserById(contactId);
      if (userToAdd) {
        await addContactToUser({
          uid: userToAdd.id,
          name: userToAdd.name,
          email: userToAdd.email,
          status: userToAdd.status,
          profilePicture: userToAdd.profilePicture,
          contacts: {},
        });
        await fetchContacts(); // Recargar la lista de contactos
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

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
    <div className="h-full w-full mx-auto bg-main-color flex flex-col relative shadow-lg">
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
            onAddContact={handleAddContact}
            withoutContactAction={() => setShowModal(true)}
            onSearch={(text) => setSearchText(text)}
          />
          {contacts.length > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="absolute bottom-6 right-6 bg-royal-blue hover:bg-blue-500 w-14 h-14 rounded-full flex items-center justify-center shadow-md"
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
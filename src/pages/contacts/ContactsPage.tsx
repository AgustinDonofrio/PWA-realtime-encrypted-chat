import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import ContactList from "../../components/contacts/ContactList";
import AddContactModal from "../../components/modal/AddContactModal";
import { db, auth } from "../../firebase/firebase.config";
import { getUserByEmail, getLoggedEmail, getUserById, addContactToUser, subscribeToContacts } from "../../controllers/userController";
import { getLastMessage, getMessagesByUser, subscribeToLastMessages } from "../../controllers/messageController";
import Spinner from "../../components/spinner/Spinner";

interface ContactsPageProps {
  onContactClick?: (contactId: string) => void;
  onSettingsClick?: () => void;
}

const ContactsPage: React.FC<ContactsPageProps> = ({ onContactClick, onSettingsClick }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState<
    { name: string; email: string; status: string; profilePicture: string; id: string; lastMessage: string, isFile: boolean, isAgended?: boolean }[]
  >([]);
  const [filteredContacts, setFilteredContacts] = useState<
    { name: string; email: string; status: string; profilePicture: string; id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [addingContacts, setAddingContacts] = useState<string[]>([]);

  const handleContactClick = (contactId: string) => {
  if (onContactClick !== undefined) {
      onContactClick(contactId); // Llamar a la función del padre (Desktop)
    } else {
      navigate(`/chat/${contactId}`); // Navegar a la página de chat (Mobile)
    }
  };

  const fetchContacts = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
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
  
      if (!auth.currentUser?.uid) {
        console.error("User is not authenticated");
        setLoading(false);
        return;
      }
  
      // Obtener contactos agendados
      const agendedContacts: { [key: string]: { name: string; status: string; profilePicture: string; email: string } } =
        (userData.data && "contacts" in userData.data) ? userData.data.contacts : {};
  
      // Obtener todos los mensajes del usuario actual
      const messages = await getMessagesByUser(auth.currentUser.uid);
  
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
  
      // Combinar IDs de contactos agendados y de mensajes
      const allUserIds = new Set([...Object.keys(agendedContacts), ...Array.from(messageUserIds)]);

      // Obtener datos para cada usuario
      const contactsData = await Promise.all(
        Array.from(allUserIds).filter((userId) => !!userId).
          map(async (userId) => {
          const isAgended = agendedContacts[userId] !== undefined;
          const lastMessage = await getLastMessage(userId);
  
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
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Suscribirse a los últimos mensajes
  useEffect(() => {
    if (!auth.currentUser?.uid) return;
  
    const unsubscribeMessage = subscribeToLastMessages(auth.currentUser.uid, async (newMessages) => {
      setContacts((prevContacts) => {
        const updatedContacts = [...prevContacts];
  
        newMessages.forEach(async (message) => {
          const newUserId = message.from === auth.currentUser?.uid ? message.to : message.from;
          
          // Verificar si el contacto ya existe en la lista
          const existingContact = updatedContacts.find((contact) => contact.id === newUserId);

          if (!existingContact) {
            // Si el contacto no existe, obtener sus datos y agregarlo
            const userDoc = await getUserById(newUserId);
  
            if (userDoc) {
              updatedContacts.push({
                id: newUserId,
                name: userDoc.name || "Unknown",
                status: userDoc.status || "",
                profilePicture: userDoc.profilePicture || "",
                email: userDoc.email || "",
                lastMessage: message.text || "",
                isFile: message.isFile || false,
                isAgended: false, // Marcar como no agendado
              });
            }
          } else {
            // Si el contacto ya existe, actualizar su último mensaje
            existingContact.lastMessage = message.text || "";
            existingContact.isFile = message.isFile || false;
          }
        });
  
          // if (existingContact) {
          //   // Si el contacto ya existe, actualiza su último mensaje
          //   existingContact.lastMessage = message.text || "";
          //   existingContact.isFile = message.isFile || false;
          // } else {
          //   // Si no existe, obtén sus datos y agrégalo
          //   const newUserId = message.from === auth.currentUser?.uid ? message.to : message.from;
          //   const userDoc = await getUserById(newUserId);
  
          //   if (userDoc) {
          //     updatedContacts.push({
          //       id: newUserId,
          //       name: userDoc.name || "Unknown",
          //       status: userDoc.status || "",
          //       profilePicture: userDoc.profilePicture || "",
          //       email: userDoc.email || "",
          //       lastMessage: message.text || "",
          //       isFile: message.isFile || false,
          //       isAgended: false,
          //     });
          //   }
          // }
        // });
  
        //return [...updatedContacts];
        return updatedContacts;
      });
    });
  
    return () => unsubscribeMessage();
  }, []);

  // Suscribirse a cambios en los contactos del usuario actual
  useEffect(() => {
    if (!auth.currentUser?.uid) return;
  
    // Suscribirse a cambios en los contactos del usuario actual
    const unsubscribeContacts = subscribeToContacts(auth.currentUser.uid, (contacts) => {
      // Actualizar la lista de contactos en el estado
      setContacts((prevContacts) => {
        const updatedContacts = prevContacts.map((contact) => {
          if (contacts[contact.id]) {
            // Si el contacto está en la lista actualizada, marcarlo como agendado
            return { ...contact, isAgended: true };
          }
          return contact;
        });
        return updatedContacts;
      });
    });
  
    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribeContacts();
  }, [auth.currentUser?.uid]);
  

  const handleAddContact = async (contactId: string) => {
    setAddingContacts(prev => [...prev, contactId]);
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
        await fetchContacts(false);
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    } finally {
      setAddingContacts(prev => prev.filter(id => id !== contactId));
    }
  };

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
        leftButton="logo"
        title="BlueCrypt"
        rightButton="settings"
        onSettingsClick={onSettingsClick}
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
            onContactClick={handleContactClick}
            addingContacts={addingContacts}
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
          )}
        </>
      )}
    </div>
  );
};

export default ContactsPage;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import ContactList from "../../components/contacts/ContactList";
import AddContactModal from "../../components/modal/AddContactModal";
import { auth } from "../../firebase/firebase.config";
import { getUserByEmail, getLoggedEmail, getUserById, addContactToUser, subscribeToContacts } from "../../controllers/userController";
import { getLastMessage, getMessagesByUser, subscribeToLastMessages, subscribeToUnreadMessages, markMessagesAsRead } from "../../controllers/messageController";
import Spinner from "../../components/spinner/Spinner";
import { saveToIndexedDB, getFromIndexedDB } from "../../controllers/indexDbHelpers"

interface ContactsPageProps {
  onContactClick?: (contactId: string) => void;
  onSettingsClick?: () => void;
}

const ContactsPage: React.FC<ContactsPageProps> = ({ onContactClick, onSettingsClick }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState<
    { name: string; 
      email: string; 
      status: string; 
      profilePicture: string; 
      id: string; 
      lastMessage: string; 
      isFile: boolean; 
      isAgended?: boolean;
      lastMessageDate?: Date;
     }[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<
    { name: string; 
      email: string; 
      status: string; 
      profilePicture: string; 
      id: string;  
      lastMessageDate?: Date;
    }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [addingContacts, setAddingContacts] = useState<string[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<{ [chatId: string]: number }>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleContactClick = async (contactId: string) => {
    setActiveChatId(contactId); // Guardar el chat activo
    await markMessagesAsRead(contactId)  // Marcar mensajes como leídos para ese contacto

    if (onContactClick !== undefined) {
      onContactClick(contactId); // Llamar a la función del padre (Desktop)
    } else {
      navigate(`/chat/${contactId}`); // Navegar a la página de chat (Mobile)
    }
  };

  const contactsRef = useRef(contacts);

  useEffect(() => {
    contactsRef.current = contacts;
  }, [contacts]);

  const fetchContacts = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      console.log(navigator.onLine)
      if (!navigator.onLine) {
        const offlineContacts = await getFromIndexedDB("contacts");
        setContacts(offlineContacts);
        setFilteredContacts(offlineContacts);
        setLoading(false);

        return;
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
        if (message.from !== auth.currentUser?.uid) messageUserIds.add(message.from);
        
        if (message.to !== auth.currentUser?.uid) messageUserIds.add(message.to);
  
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
                lastMessageDate: lastMessage?.creationDate?.toDate ? lastMessage.creationDate.toDate() : new Date(lastMessage?.creationDate || 0),
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
                lastMessageDate: lastMessage?.creationDate?.toDate ? lastMessage.creationDate.toDate() : new Date(lastMessage?.creationDate || 0),
              };
            }
          })
      );

      // Ordenar contactos por la fecha del último mensaje (más reciente primero)
      contactsData.sort((a, b) => (b.lastMessageDate?.getTime() || 0) - (a.lastMessageDate?.getTime() || 0));

      for (const contactItem of contactsData) {
        await saveToIndexedDB("contacts", contactItem)
      }

      setContacts(contactsData);
      setFilteredContacts(contactsData);
    } catch (error) {
      console.error("Error obteniendo contactos:", error);
    } finally {
      if (showLoading) setLoading(false);
      
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Suscribirse a los mensajes no leídos
  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const unsubscribeUnread = subscribeToUnreadMessages(auth.currentUser.uid, (unreadCounts) => {
      setUnreadCounts(unreadCounts);
    });
    return () => unsubscribeUnread();

  }, [auth.currentUser?.uid]);

  // Suscribirse a los últimos mensajes
  useEffect(() => {
    if (!auth.currentUser?.uid) return;
  
    const unsubscribe = subscribeToLastMessages(auth.currentUser.uid, (newMessages) => {
       newMessages.forEach(async (message) => {
          const currentUserId = auth.currentUser?.uid;
          if (!currentUserId) return;
  
          const otherUserId = message.from === currentUserId ? message.to : message.from;
  
          if (otherUserId === activeChatId) {
            await markMessagesAsRead(otherUserId); // Si el chat abierto es del remitente, marcar como leído
          }
  
          setContacts(prev => {
             const updatedContacts = prev.map(c => 
                c.id === otherUserId 
                   ? { 
                      ...c, 
                      lastMessage: message.text || "", 
                      isFile: message.isFile || false, 
                      lastMessageDate: message.creationDate?.toDate ? message.creationDate.toDate() : new Date(message.creationDate || 0) 
                   }
                   : c
             );
             updatedContacts.sort((a, b) => (b.lastMessageDate?.getTime() || 0) - (a.lastMessageDate?.getTime() || 0));
             return updatedContacts;
          });
       });
    });
  
    return () => unsubscribe();
  }, [activeChatId]); // Se ejecutará cada vez que cambie el chat activo
 

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
    setAddingContacts((prev) => [...prev, contactId]);
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
      setAddingContacts((prev) => prev.filter(id => id !== contactId));
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
            unreadCounts={unreadCounts}
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
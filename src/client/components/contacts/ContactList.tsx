import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';

import ContactCard from "./ContactCard";

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<
    { name: string; status: string; image: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // ID del documento del usuario principal
  const userDocId = "aQjdSFc94VzIdfAGQVLh";

  const fetchContacts = async () => {
    try {
      setLoading(true);
      console.log("[X] Obteniendo contactos...");

      // 1. Obtener el documento del usuario principal
      const userDocRef = doc(db, "users", userDocId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error("Usuario no encontrado");
        setLoading(false);
        return;
      }

      const userData = userDocSnap.data();
      const contactIds = userData.contacts || [];

      // 2. Obtener datos de los contactos
      const contactPromises = await contactIds.map(async (contactId: string) => {
        const contactDocRef = doc(db, "users", contactId);
        const contactDocSnap = await getDoc(contactDocRef);

        if (!contactDocSnap.exists()) {
          console.error(`Contacto con ID ${contactId} no encontrado`);
          return null;
        }

        const contactData = contactDocSnap.data();
        return {
          name: contactData?.name || "Unknown",
          status: contactData?.status || "-",
          image: contactData?.profilePicture || "default.jpg",
        };
      });

      console.log("[X] Contacts ->", contactPromises);
      // Esperar todas las promesas
      const contactsData = (await Promise.all(contactPromises)).filter(
        (contact) => contact !== null
      ) as { name: string; status: string; image: string }[];

      setContacts(contactsData);
    } catch (error) {
      console.error("Error obteniendo contactos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="overflow-y-auto flex-1">
      {loading ? (
        <p className="text-white text-center">Cargando contactos...</p>
      ) : contacts.length === 0 ? (
        <p className="text-white text-center">No tienes contactos.</p>
      ) : (
        contacts.map((contact, index) => (
          <ContactCard
            key={index}
            name={contact.name}
            status={contact.status}
            image={contact.image}
          />
        ))
      )}
    </div>
  );
};

export default ContactList;
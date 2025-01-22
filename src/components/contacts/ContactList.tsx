import React, { useState, useEffect } from "react";
import { getUserById } from "../../controllers/userController";
import ContactCard from "./ContactCard";
import SearchBar from "./SearchBar";
import Spinner from "../spinner/Spinner";


const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<
    { name: string; status: string; image: string; id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // ID del documento del usuario principal
  const userDocId = "tOdmKCe4wsfasJqqdPHFV3xaF6I2";

  const fetchContacts = async () => {
    try {
      setLoading(true);

      // 1. Obtener el documento del usuario principal
      const userData = await getUserById(userDocId);

      if (userData == null) {
        console.error("Usuario no encontrado");
        setLoading(false);
        return;
      }

      const contactIds = userData.contacts || [];

      // 2. Obtener datos de los contactos
      const contactPromises = await contactIds.map(async (contactId: string) => {
        const contactData = await getUserById(contactId);

        if (contactData == null) {
          console.error(`Contacto con ID ${contactId} no encontrado`);
          return null;
        }

        return {
          name: contactData?.name || "Unknown",
          status: contactData?.status || "-",
          image: contactData?.profilePicture || "",
          id: contactData?.id || "Unknown",
        };
      });

      console.log("[X] Contacts ->", contactPromises);
      // Esperar todas las promesas
      const contactsData = (await Promise.all(contactPromises)).filter(
        (contact) => contact !== null
      ) as { name: string; status: string; image: string; id: string }[];

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
        <Spinner message="Loading contacts..." />
      ) : contacts.length === 0 ? (
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
              image={contact.image}
              id={contact.id}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ContactList;
// import React, { useState, useEffect } from 'react';
// import { doc, getDoc, collection } from 'firebase/firestore';
// import db from '../../firebase/firebaseConfig';

// import ContactCard from "./ContactCard";

// const ContactList: React.FC = () => {
//   const [contacts, setContacts] = useState<
//     { name: string; status: string; image: string }[]
//   >([]);
//   const [loading, setLoading] = useState(true);

//   // ID del documento del usuario principal
//   const userDocId = "userDocId";

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);

//       // 1. Obtener el documento del usuario principal
//       const userDocRef = doc(db, "users", userDocId);
//       const userDocSnap = await getDoc(userDocRef);

//       if (!userDocSnap.exists()) {
//         console.error("Usuario no encontrado");
//         setLoading(false);
//         return;
//       }

//       const userData = userDocSnap.data();
//       const contactIds = userData.contacts || [];

//       // 2. Obtener datos de los contactos
//       const contactPromises = contactIds.map(async (contactId: string) => {
//         const contactDocRef = doc(db, "users", contactId);
//         const contactDocSnap = await getDoc(contactDocRef);

//         if (!contactDocSnap.exists()) {
//           console.error(`Contacto con ID ${contactId} no encontrado`);
//           return null;
//         }

//         const contactData = contactDocSnap.data();
//         return {
//           name: contactData?.name || "Unknown",
//           status: contactData?.status || "No status",
//           image: contactData?.profilePicture || "default.jpg",
//         };
//       });

//       // Esperar todas las promesas
//       const contactsData = (await Promise.all(contactPromises)).filter(
//         (contact) => contact !== null
//       ) as { name: string; status: string; image: string }[];

//       setContacts(contactsData);
//     } catch (error) {
//       console.error("Error obteniendo contactos:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   return (
//     <div className="overflow-y-auto flex-1">
//       {loading ? (
//         <p className="text-white text-center">Cargando contactos...</p>
//       ) : contacts.length === 0 ? (
//         <p className="text-white text-center">No tienes contactos.</p>
//       ) : (
//         contacts.map((contact, index) => (
//           <ContactCard
//             key={index}
//             name={contact.name}
//             status={contact.status}
//             image={contact.image}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default ContactList;

import React from "react";

import ContactCard from "./ContactCard";

const ContactList: React.FC = () => {
  const contacts = [
    { name: "Ava Martinez", status: "I'm a QA tester", image: "Ava.jpg" },
    { name: "Ethan Johnson", status: "I'm a designer", image: "Ethan.jpg" },
    { name: "Liam Davis", status: "I'm a professional chef", image: "Liam.jpg" },
    { name: "Mia Rodriguez", status: "I'm a software engineer", image: "Mia.jpg" },
    { name: "Olivia Smith", status: "I'm a product manager", image: "Olivia.jpg" },
    { name: "Sophia Brown", status: "I'm a yoga instructor", image: "Sophia.jpg" },
    { name: "William Williams", status: "I'm a data scientist", image: "William.jpg" },
  ];

  return (
    <div className="overflow-y-auto flex-1">
      {contacts.map((contact, index) => (
        <ContactCard
          key={index}
          name={contact.name}
          status={contact.status}
          image={contact.image}
        />
      ))}
    </div>
  );
};

export default ContactList;
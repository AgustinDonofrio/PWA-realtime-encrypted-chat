import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPlus, FaBan } from "react-icons/fa";
import { FaCamera, FaVideo } from "react-icons/fa";

interface ContactCardProps {
  name: string;
  email: string;
  status: string;
  profilePicture?: string;
  id: string;
  lastMessage?: string; // Último mensaje enviado o recibido
  isFile?: boolean; // Si el último mensaje es un archivo
  isAgended?: boolean // Indica si el usuario está en la lista de contactos
}

const ContactCard: React.FC<ContactCardProps> = ({ name, email, status, profilePicture, id, lastMessage, isFile, isAgended }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-4 p-2.5 ml-4 mr-4 mt-2 hover:bg-steel rounded-lg cursor-pointer"
      onClick={() => navigate(`/chat/${id}`)}
    >
      {/* Imagen/ícono del contacto */}
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={""}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <FaUser className="text-white text-2xl bg-gray-500" />
        )}
      </div>

      {/* Detalles del contacto */}
      <div>
        <h2 className="text-white font-medium">
          {isAgended ? name : email}
        </h2>
        <p className="text-gray-400 text-sm">
          {lastMessage && isAgended? (
            isFile ? (
              <FaCamera className="inline-block text-gray-400" />
            ) : (
              lastMessage
            )
          ) : (
            isAgended ? status : "This contact is not added"
          )}
        </p>
      </div>
    </div>
  );
};

export default ContactCard;
import React from "react";
import { FaUser, FaPlus, FaBan } from "react-icons/fa";
import { FaCamera, FaVideo } from "react-icons/fa";
import Spinner from "../spinner/Spinner";

interface ContactCardProps {
  name: string;
  email: string;
  status: string;
  profilePicture?: string;
  id: string;
  lastMessage?: string; // Último mensaje enviado o recibido
  isFile?: boolean; // Si el último mensaje es un archivo
  isAgended?: boolean; // Indica si el usuario está en la lista de contactos
  isAdding?: boolean; // Indica si se está añadiendo el contacto
  onAddContact?: (id: string) => void; // Función para agregar un contacto no agendado
  onClick?: (id: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ name, email, status, profilePicture, id, lastMessage, isFile, isAgended, onAddContact, onClick, isAdding }) => {

  return (
    <div
      className="flex items-center gap-4 p-2.5 ml-4 mr-4 mt-2 hover:bg-steel rounded-lg cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      {/* Imagen/ícono del contacto */}
      <div className="w-12 h-12 min-w-12 min-h-12 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
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
      <div className="line-clamp-3">
        <h2 className="text-white font-medium truncate">
          {isAgended ? name : email}
        </h2>
        <p className="text-gray-400 text-sm truncate">
          {lastMessage && isAgended ? (
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
      {/* Botones de acción para contactos no agendados */}
      {!isAgended && (
        <div className="flex gap-2 ml-auto">
          {/* <button
            onClick={(e) => {
              e.stopPropagation(); // Evitar que se active el onClick del contenedor
              //onBlockContact?.(id);
            }}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500"
            title="Bloquear contacto"
          >
            <FaBan />
          </button> */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evitar que se active el onClick del contenedor
              onAddContact?.(id);
            }}
            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-500 flex items-center justify-center"
            title="Add contact"
            disabled={isAdding}
          >
            {isAdding ? <Spinner size={20} color="#A3D4FF" /> : <FaPlus />}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactCard;
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaCamera, FaVideo } from "react-icons/fa";

interface ContactCardProps {
  name: string;
  status: string;
  image?: string;
  id: string;
  lastMessage?: string; // Último mensaje enviado o recibido
  isFile?: boolean; // Si el último mensaje es un archivo
}

const ContactCard: React.FC<ContactCardProps> = ({ name, status, image, id, lastMessage, isFile }) => {
  const navigate = useNavigate();

  console.log("Ultimo mensaje: ",lastMessage, "es archivo? ", isFile)

  return (
    <div
      className="flex items-center gap-4 p-2.5 ml-4 mr-4 mt-2 hover:bg-steel rounded-lg cursor-pointer"
      onClick={() => navigate(`/chat/${id}`)}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={`${name}'s profile`}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <FaUser className="text-white text-2xl bg-gray-500" />
        )}
      </div>
      <div>
        <h2 className="text-white font-medium">{name}</h2>
        <p className="text-gray-400 text-sm">
        {lastMessage ? (
          isFile ? (
            <FaCamera className="inline-block text-gray-400" />
          ) : (
            lastMessage
          )
        ) : (
          status
        )}
        </p>
      </div>
    </div>
  );
};

export default ContactCard;
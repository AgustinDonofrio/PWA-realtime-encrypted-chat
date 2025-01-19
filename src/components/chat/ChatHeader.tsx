import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  name: string;
  image: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, image }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-main-color border-b border-gray-700">
      <button className="text-white text-2xl"
        onClick={() => navigate("/contacts")}
      >
        <FiArrowLeft />
      </button>
      <h1 className="text-lg font-medium flex-grow">{name}</h1>
      <img
        src={`/images/contacts/${image}`}
        alt={name}
        className="w-10 h-10 rounded-full"
      />
    </div>
  );
};

export default ChatHeader;
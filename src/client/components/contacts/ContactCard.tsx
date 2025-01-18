import React from "react";

interface ContactCardProps {
  name: string;
  status: string;
  image: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ name, status, image }) => {
  return (
    <div 
      className="flex items-center gap-4 p-4 hover:bg-gray-800 cursor-pointer"
    >
      <img
        src={`/images/contacts/${image}`}
        alt={name}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h2 className="text-white font-medium">{name}</h2>
        <p className="text-gray-400 text-sm">{status}</p>
      </div>
    </div>
  );
};

export default ContactCard;
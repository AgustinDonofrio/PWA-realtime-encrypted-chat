import React from "react";
import { formatTime } from "../../helpers/utils";
import Spinner from "../spinner/Spinner";

interface MessageBubbleProps {
  text?: string;
  imageUrl?: string;
  isSender: boolean;
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, imageUrl, isSender, timestamp }) => {
  return (
    <div
      className={`relative flex flex-col min-w-[3.5rem] max-w-[78%] px-3 py-2 rounded-lg shadow-md break-words w-fit mb-2 ${isSender
        ? "ml-auto bg-royal-blue text-white"
        : "mr-auto bg-steel text-white"
        }`}
    >
      {imageUrl?.length == 0 && text?.length == 0 ? <Spinner color="#A3D4FF"></Spinner> : null}
      {/* Mostrar contenido (texto o imagen) */}
      {imageUrl ? <img className="max-w-sm max-h-sm" src={imageUrl} alt="image" /> : text}

      {/* Mostrar hora en la esquina inferior derecha */}
      <div className="flex justify-end mt-1">
        <span className="text-[11px] text-gray-400">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
import React, { useState } from "react";
import { formatTime } from "../../helpers/utils";
import Spinner from "../spinner/Spinner";
import { FaExclamationCircle } from "react-icons/fa"


interface MessageBubbleProps {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  isSender: boolean;
  timestamp: Date;
  onImageLoad?: () => void;
  withConnection: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, imageUrl, videoUrl, isSender, timestamp, onImageLoad, withConnection }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (onImageLoad) {
      onImageLoad();
    }
  };

  return (
    <div className={`flex flex-row max-w-[50%] items-center gap-3 ${isSender ? "ml-auto justify-end" : "mr-auto"}`}>
      {!withConnection ? <FaExclamationCircle color="#E74C3C"></FaExclamationCircle> : null}
      <div
        className={`relative flex flex-col min-w-[3.5rem] max-w-md px-3 py-2 rounded-lg shadow-md break-words mb-2 ${isSender
          ? " bg-royal-blue text-white"
          : " bg-steel text-white"
          }`}
      >
        {imageUrl?.length == 0 && text?.length == 0 && videoUrl?.length == 0 ? <Spinner color="#A3D4FF"></Spinner> : null}
        {/* Mostrar contenido (texto o imagen) */}

        {imageUrl
          ? <img src={imageUrl} alt="image" onLoad={handleImageLoad} />
          : videoUrl ? <video controls crossOrigin="anonymous">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support videos.
          </video> : text
        }



        {/* Mostrar hora en la esquina inferior derecha */}
        <div className="flex justify-end mt-1">
          <span className="text-[11px] text-gray-400">{formatTime(timestamp)}</span>
        </div>
      </div>
    </div>

  );
};

export default MessageBubble;
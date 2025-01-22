import React from "react";

interface MessageBubbleProps {
  text?: string;
  imageUrl?: string;
  isSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, imageUrl, isSender }) => {
  return (
    <div
      className={`${isSender ? "bg-royal-blue text-white ml-auto" : "bg-steel text-white mr-auto"} 
                  px-4 py-2 rounded-lg shadow-md max-w-[78%] w-fit break-words`}
      style={{
        wordWrap: "break-word",
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap", // Conserva saltos de línea
      }}
    >
      {imageUrl ? <img className="max-w-md max-h-md" src={imageUrl} alt="image" /> : text}
    </div>
  );
};

export default MessageBubble;
import React from "react";

interface MessageBubbleProps {
  text: string;
  isSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isSender }) => {
  return (
    <div
      className={`${isSender ? "bg-royal-blue text-white ml-auto" : "bg-steel text-white mr-auto"} 
                  px-4 py-2 rounded-lg max-w-[78%] break-words`}
                  style={{
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap", // Conserva saltos de línea
                  }}
    >
      {text}
    </div>
  );
};

export default MessageBubble;
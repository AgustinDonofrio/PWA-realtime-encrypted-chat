import React, { useRef } from "react";
import { FiSend, FiImage } from "react-icons/fi";

interface InputBarProps {
  onSend: (message: string) => void;
}

const InputBar: React.FC<InputBarProps> = ({ onSend }) => {
  const [message, setMessage] = React.useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_LINES = 6; // Número máximo de líneas permitidas (en mobile)

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Restablece la altura para calcular el scrollHeight
      const lineHeight = parseInt(
        window.getComputedStyle(textarea).lineHeight || "0"
      );
      const maxHeight = MAX_LINES * lineHeight; // Calcula la altura máxima
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;

      // Muestra el scroll si el contenido supera la altura máxima
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "scroll" : "hidden";
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage(""); // Limpia el mensaje
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // Restablece la altura
        textareaRef.current.style.overflowY = "hidden"; // Oculta el scroll
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Evita el salto de línea
      handleSend(); // Envía el mensaje
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-700 bg-main-color">
      <button className="text-white text-2xl">
        <FiImage />
      </button>
      <textarea
        ref={textareaRef}
        value={message}
        onInput={handleInput}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        rows={1} // Altura inicial de 1 línea
        className="flex-1 resize-none bg-steel text-white text-sm rounded-lg p-3 focus:outline-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
        style={{
          maxHeight: `${MAX_LINES * 1.5}rem`, // Altura máxima basada en el número de líneas
        }}
      />
      <button
        className={`text-2xl ${
          message.trim() ? "text-white" : "text-light-gray"
        }`}
        onClick={handleSend}
      >
        <FiSend />
      </button>
    </div>
  );
};

export default InputBar;
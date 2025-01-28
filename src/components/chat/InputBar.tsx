import React, { useState, useRef } from "react";
import { FiSend, FiImage } from "react-icons/fi";
import { uploadImage } from "../../controllers/messageController";
import { uploadToCloudinary } from "../../controllers/cloudinaryController"

interface InputBarProps {
  onSend: (message: string, imageFile?: File) => void;
}

const InputBar: React.FC<InputBarProps> = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null); // Estado para el progreso de subida
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {

        onSend("", file)

      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploadProgress(null); // Restablecer progreso al finalizar
      }
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-main-color relative">
      {/* Botón de subir imagen */}
      <label htmlFor="image-upload" className="text-white text-2xl cursor-pointer">
        <FiImage />
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Área de texto para mensajes */}
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

      {/* Botón para enviar mensaje */}
      <button
        className={`text-2xl ${message.trim() ? "text-white" : "text-light-gray"
          }`}
        onClick={handleSend}
      >
        <FiSend />
      </button>

      {/* Barra de progreso de subida */}
      {uploadProgress !== null && (
        <div className="absolute bottom-[-12px] left-0 w-full bg-main-color h-2">
          <div
            className="bg-royal-blue h-2"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default InputBar;
import React from "react";
import { FiArrowLeft, FiSettings } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBackButton?: boolean; 
  showSettingsIcon?: boolean; 
  showProfileImage?: boolean;
  profileImageUrl?: string;
  handleNavigation: (destination: "back" | "settings") => string; // Determina las rutas dinámicamente
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showSettingsIcon = false,
  showProfileImage= false,
  profileImageUrl,
  handleNavigation,
}) => {
  const navigate = useNavigate();

  const handleNavigate = (destination: "back" | "settings") => {
    const route = handleNavigation(destination);
    navigate(route);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-main-color border-b border-gray-700">
      {/* Botón de retroceso */}
      {showBackButton && (
        <button
          onClick={() => handleNavigate("back")}
          className="text-white text-2xl mr-4 hover:text-gray-300 focus:outline-none"
        >
          <FiArrowLeft className="text-white bg-main-color" />
        </button>
      )}

      {/* Título */}
      <h1 className="text-white text-xl font-semibold flex-grow text-center">{title}</h1>
    
      {/* Imagen de perfil (opcional) */}
      {showProfileImage && (
        profileImageUrl ? (
            <img
            src={profileImageUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-4"
            />
        ) : (
            <FaUser className="text-2xl text-white bg-main-color" />
        )
      )}

      {/* Ícono de configuración */}
      {showSettingsIcon && (
        <button
          onClick={() => handleNavigate("settings")}
          className="text-white text-2xl hover:text-gray-300 focus:outline-none"
        >
          <FiSettings className="text-white bg-main-color" />
        </button>
      )}
    </div>
  );
};

export default Header;
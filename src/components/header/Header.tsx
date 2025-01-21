import React, { useState } from "react";
import { FiArrowLeft, FiSettings, FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout } from "../../controllers/authController";

interface HeaderProps {
  title: string;
  leftButton?: "back";
  rightButton?: "settings" | "logout" | "profile"; 
  profileImageUrl?: string; // Imagen de perfil (solo relevante si el botón derecho es "profile")
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftButton,
  rightButton,
  profileImageUrl,
}) => {
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false); // Estado para mostrar u ocultar el cartel de confirmación

  const handleNavigate = (destination: "back" | "settings") => {
    if (destination === "back") {
      navigate(-1); // Retrocede en la navegación
    } else {
      navigate("/settings");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        navigate("/");
      } else {
        console.error("Error during logout:", response.msg);
      }
    } catch (error) {
      console.error("Unexpected error during logout:", error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-main-color border-b border-gray-700">
      {/* Botón izquierdo */}
      {leftButton === "back" && (
        <button
          onClick={() => handleNavigate("back")}
          className="text-white text-2xl hover:text-gray-300 focus:outline-none"
        >
          <FiArrowLeft className="text-white bg-main-color" />
        </button>
      )}

      {/* Título */}
      <h1 className="text-white text-xl font-semibold text-center flex-grow">
        {title}
      </h1>

      {/* Botón o ícono derecho */}
      {rightButton === "settings" && (
        <button
          onClick={() => handleNavigate("settings")}
          className="text-white text-2xl hover:text-gray-300 focus:outline-none"
        >
          <FiSettings className="text-white bg-main-color" />
        </button>
      )}

      {rightButton === "logout" && (
        <button
          onClick={() => setShowConfirmLogout(true)} // Mostrar el cartel de confirmación
          className="text-white text-2xl hover:text-gray-300 focus:outline-none"
        >
          <FiLogOut className="text-red-500 bg-main-color" />
        </button>
      )}

      {rightButton === "profile" &&
        (profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <FaUser className="text-white text-2xl bg-main-color" />
        ))}

      {/* Cartel de confirmación de cierre de sesión */}
      {showConfirmLogout && (
        <div className="fixed inset-0 flex items-center justify-center bg-main-color bg-opacity-80">
          <div className="bg-main-color p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Are you sure to log out?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmLogout(false)} // Cierra el cartel
                className="px-4 py-2 bg-royal-blue text-white rounded hover:bg-blue-500 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout} // Confirma el cierre de sesión
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 focus:outline-none"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
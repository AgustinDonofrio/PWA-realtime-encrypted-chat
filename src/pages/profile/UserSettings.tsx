import React, { useState } from "react";
import { FiCamera } from "react-icons/fi";
import Header from "../../components/header/Header";

const UserSettings: React.FC = () => {
  const [useGooglePhoto, setUseGooglePhoto] = useState(false);
  const [username, setUsername] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  return (
    <div
      className="h-screen w-full mx-auto bg-main-color flex flex-col relative shadow-lg"
    >
      {/* Header */}
      <Header 
        title="Profile settings" 
        showBackButton 
        handleNavigation={(destination) => 
          destination === "back" ? "/contacts" : "/settings"
        }
      />

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 space-y-6">
        {/* Toggle Google Profile Photo */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white text-s font-medium">Google profile photo</h2>
            <p className="text-gray-400 text-xs">Use google profile photo</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useGooglePhoto}
              onChange={() => setUseGooglePhoto(!useGooglePhoto)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-blue-500 peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            <div className="w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 left-0.5 transition-transform peer-checked:translate-x-5"></div>
          </label>
        </div>

        {/* Upload Custom Profile Photo */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white text-s font-medium">Custom profile photo</h2>
            <p className="text-gray-400 text-xs">Upload a photo</p>
          </div>
          <button className="flex items-center justify-center w-10 h-10 text-white text-2xl">
            <FiCamera />
          </button>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-white text-s font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Agustín D'Onofrio"
            className="mt-1 w-full px-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Message */}
        <div>
          <label htmlFor="statusMessage" className="block text-white text-s font-medium">
            Status Message
          </label>
          <input
            type="text"
            id="statusMessage"
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            placeholder="El que no gana el concurso se la co"
            className="mt-1 w-full px-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Save Button */}
        <button className="mt-auto px-6 py-3 bg-royal-blue text-white font-medium rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300">
          Save
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
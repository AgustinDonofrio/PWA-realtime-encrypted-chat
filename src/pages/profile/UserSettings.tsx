import React, { useState, useEffect } from "react";
import { FiCamera, FiEdit2, FiCheck } from "react-icons/fi";
import Header from "../../components/header/Header";
import LoadingPage from "../loading/LoadingPage";
import { getAuth, User } from "firebase/auth";
import { getUserById, updateProfilePicture } from "../../controllers/userController";
import Snackbar from "../../components/snackbar/Snackbar";
import Switch from "../../components/switch/Switch";

interface UserSettingsProps {
  onMessageClick?: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ onMessageClick }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<{ name: string; status: string; profilePicture: string }>({
    name: "",
    status: "Hi 👋, I'm using BlueCrypt!",
    profilePicture: "",
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const isDesktop = window.innerWidth > 768;

  const [snackbar, setSnackbar] = useState<{ isOpen: boolean; message: string; type: "success" | "error" | "info" }>({
    isOpen: false,
    message: "",
    type: "info",
  });

  const showSnackbar = (message: string, type: "success" | "error" | "info" = "info") => {
    setSnackbar({ isOpen: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);

      // Obtener información adicional del usuario desde Firestore
      const fetchUserProfile = async () => {
        try {
          const userData: any = await getUserById(currentUser.uid);
          if (userData) {
            setProfileData({
              name: userData.name || "Unknown User",
              status: userData.status || "Hi 👋, I'm using BlueCrypt!",
              profilePicture: userData.profilePicture || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user profile: ", error);
          showSnackbar("Failed to fetch user data.", "error")
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSaveName = () => {
    setIsEditingName(false);
    showSnackbar("Name updated successfully!", "success");
    console.log("Nuevo nombre guardado:", profileData.name); // COMPLETAR!
  };

  const handleSaveStatus = () => {
    setIsEditingStatus(false);
    showSnackbar("Status updated successfully!", "success");
    console.log("Nuevo estado guardado:", profileData.status); // COMPLETAR!
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      handleUpload(event.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    if (!user) return;

    setUploading(true);

    try {
      const { imageUrl } = await updateProfilePicture(file, user.uid);
      if (imageUrl) {
        setProfileData((prev) => ({ ...prev, profilePicture: imageUrl }));
        showSnackbar("Profile picture updated successfully!", "success");
      } else {
        showSnackbar("Failed to upload the photo.", "error");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      showSnackbar("An error occurred while uploading the photo.", "error");
    } finally {
      setUploading(false);
    }
  };
  // Función mejorada para dividir el texto sin cortar palabras
  const formatTextWithLineBreaks = (text: string, maxChars: number) => {
    const words = text.split(" ");
    let line = "";
    const lines: string[] = [];

    for (const word of words) {
      if ((line + word).length > maxChars) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line += word + " ";
      }
    }

    if (line.trim()) {
      lines.push(line.trim());
    }

    return lines.join("\n");
  };

  // Mostrar pantalla de carga mientras se está cargando la información
  if (loading || uploading) {
    return <LoadingPage />;
  }

  return (
    <div className="h-screen w-full mx-auto bg-main-color flex flex-col relative shadow-lg">
      {/* Header */}
      <Header
        title="Profile settings"
        leftButton={isDesktop ? "message" : "back"}
        rightButton="logout"
        onMessageClick={onMessageClick}
      />

      {/* Foto de perfil */}
      <div className="flex flex-col items-center mt-10">
        <div className="relative group w-28 h-28">
          <img
            src={profileData.profilePicture || "/path/to/default-avatar.png"}
            alt="Profile Photo"
            className="w-full h-full rounded-full object-cover border-2 border-gray-600"
          />
          {/* Ícono para cambiar la foto */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300">
            <label className="text-white text-center text-sm font-semibold flex flex-col items-center cursor-pointer">
              <FiCamera className="mb-1 text-xl" />
              Change profile photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="mt-10 px-6 relative">
          {/* Nombre del usuario */}
          <h3 className="text-gray-400 text-m mb-2">Name</h3>
          <div className="flex items-center space-x-2">
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  maxLength={25}
                  className="w-full p-2 border-b-2 border-royal-blue bg-transparent text-white outline-none"
                />
                <button onClick={handleSaveName} className="text-royal-blue">
                  <FiCheck size={20} />
                </button>
              </>
            ) : (
              <div className="relative w-full">
                <h2 className="text-white text-lg font-normal">{profileData.name}</h2>
                <div className="absolute top-0 right-0 flex space-x-4">
                  <button onClick={() => setIsEditingName(true)} className="text-gray-500 hover:text-white">
                    <FiEdit2 />
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">
            This name will be visible to all your BlueCrypt contacts.
          </p>

          {/* Estado del usuario */}
          <div className="mt-8">
            <h3 className="text-gray-400 text-m mb-2">Status</h3>
            <div className="flex items-center space-x-2">
              {isEditingStatus ? (
                <>
                  <textarea
                    value={profileData.status}
                    onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                    maxLength={120}
                    className="w-full p-2 border-b-2 border-royal-blue bg-transparent text-white outline-none resize-none overflow-hidden"
                    rows={1} // Filas visibles por defecto
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  />
                  <button onClick={handleSaveStatus} className="text-royal-blue">
                    <FiCheck size={20} />
                  </button>
                </>
              ) : (
                <div className="relative w-full">
                  <p className="text-white whitespace-pre-wrap break-words">
                    {formatTextWithLineBreaks(profileData.status, 45)}
                  </p>
                  <div className="absolute top-0 right-0 flex space-x-4">
                    <button onClick={() => setIsEditingStatus(true)} className="text-gray-500  hover:text-white">
                      <FiEdit2 />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Permitir notificaciones */}
          <div className="mt-8">
            <div className="flex flex-wrap flex-row justify-between"><h3 className="text-gray-400 text-m mb-2">Allow notifications</h3> <div><Switch isEnabled={false} onToggle={() => {

            }}></Switch></div></div>
          </div>
        </div>
      </div>
      {/* Snackbar */}
      {snackbar.isOpen && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={handleCloseSnackbar}
        />
      )}
    </div>
  );

};

export default UserSettings;
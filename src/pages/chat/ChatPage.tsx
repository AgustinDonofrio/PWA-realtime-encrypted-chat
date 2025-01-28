import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import MessageBubble from "../../components/chat/MessageBubble";
import InputBar from "../../components/chat/InputBar";
import { getUserById } from "../../controllers/userController";
import { subscribeToMessages, sendMessage } from "../../controllers/messageController";
import LoadingPage from "../loading/LoadingPage";
import { formatDate } from "../../helpers/utils";
import { uploadToCloudinary } from "../../controllers/cloudinaryController";
import Snackbar from "../../components/snackbar/Snackbar";

const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
  <div className="text-gray-400 text-sm text-center my-2">
    {date}
  </div>
);

const ChatPage: React.FC = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState<{ text?: string; imageUrl?: string; isSender: boolean, timestamp: Date }[]>([]);
  const [chatUser, setChatUser] = useState<{ name: string; imageUrl: string }>({
    name: "",
    imageUrl: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null); //Para scroll automático
  const [hasLoaded, setHasLoaded] = useState(false); // Para controlar animación inicial
  const [loading, setLoading] = useState(true);
  const [loadingImgUpload, setLoadingImgUpload] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setIsSnackbarOpen(true);
  };


  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };
  // Obtener los datos del usuario con el que se está chateando
  useEffect(() => {
    if (!userId) return;

    const fetchChatUser = async () => {
      try {
        const userData: any = await getUserById(userId);
        if (userData) {
          setChatUser({
            name: userData.name || "Unknown User",
            imageUrl: userData.profilePicture || "",
          });
        }
      } catch (error) {
        console.error("Error fetching chat user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatUser();

    scrollToBottom()
  }, [userId]);

  // Obtener mensajes en tiempo real
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToMessages(userId, (newMessages) => {
      setMessages(newMessages); // Actualizar los mensajes
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };

  }, [userId]);

  // Hacer scroll cada vez que cambian los mensajes
  useLayoutEffect(() => {
    if (!hasLoaded) {
      setHasLoaded(true);
      scrollToBottom()
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

  }, [messages]); // Este hook se dispara cuando los mensajes cambia

  // Scroll automático al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const handleSendMessage = async (message: string, imageFile?: File) => {
    scrollToBottom(); // Hacer scroll al final después de enviar un mensaje
    let imageUrl = ""
    if (userId) {


      if (imageFile) {
        setLoadingImgUpload(true);

        const imgResult = await uploadToCloudinary(imageFile)

        if (imgResult) {
          imageUrl = imgResult
        }
        setLoadingImgUpload(false);
      }

      if (imageFile && imageUrl.length == 0) {
        showSnackbar("We have problems to upload the selected image, please try again", "error")
        return
      }

      await sendMessage(userId, message, imageUrl);

    }

    setMessages([...messages, { text: message, imageUrl, isSender: true, timestamp: new Date() }]);
    scrollToBottom(); // Hacer scroll al final después de enviar un mensaje
  };

  // Función para agrupar mensajes por fecha
  const groupedMessages = messages.reduce((groups: Record<string, any[]>, msg) => {
    const date = formatDate(msg.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);

    return groups;
  }, {});

  if (loading) {
    return <LoadingPage />;
  } else {
    scrollToBottom();
  }

  return (
    <div className="h-screen w-full mx-auto bg-main-color flex flex-col relative shadow-lg">
      {/* Header */}
      <Header
        title={chatUser.name}
        leftButton="back"
        rightButton="profile"
        profileImageUrl={chatUser.imageUrl || undefined} // Mostrar imagen del usuario o un ícono por defecto
      />

      {/* Lista de mensajes */}
      {!loading ? (
        <>
          <div className="flex-1 h-full overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>
                {/* Fecha como separador */}
                <DateSeparator date={date} />

                {messages.map((msg, index) => (
                  <MessageBubble
                    key={index}
                    text={msg.text}
                    imageUrl={msg.imageUrl}
                    isSender={msg.isSender}
                    timestamp={msg.timestamp}
                  />
                ))}

              </div>
            ))}
            {loadingImgUpload ? <MessageBubble text="" imageUrl="" isSender={true} timestamp={new Date()}></MessageBubble> : null}
            <div ref={messagesEndRef} />
          </div>
          <InputBar onSend={handleSendMessage} />
        </>
      ) : (<><LoadingPage /></>)}

      {isSnackbarOpen && (
        <Snackbar
          message={snackbarMessage}
          type={snackbarType}
          onClose={handleSnackbarClose}
          duration={3000}
        />
      )}
    </div>
  );
};

export default ChatPage;
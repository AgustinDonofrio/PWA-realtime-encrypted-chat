import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import MessageBubble from "../../components/chat/MessageBubble";
import InputBar from "../../components/chat/InputBar";
import { getUserById } from "../../controllers/userController";
import { subscribeToMessages, sendMessage, fetchMessagesByPage } from "../../controllers/messageController";
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
  const [loading, setLoading] = useState(true);
  const [loadingImgUpload, setLoadingImgUpload] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');
  const [lastVisibleMessage, setLastVisibleMessage] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null); // Para scroll automático
  const chatContainerRef = useRef<HTMLDivElement>(null); // Para cargar más mensajes

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setIsSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const handleImageLoad = () => {
    // Ejecutar el scroll automático después de que la imagen se haya cargado
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
  }, [userId]);
  
  // Obtener mensajes en tiempo real
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToMessages(userId, (newMessages) => {
      if (newMessages.length > 0) { 
        setLastVisibleMessage(newMessages[newMessages.length - 1]); // Guardar el último mensaje visible
      }
      setMessages(newMessages);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (loadingImgUpload) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loadingImgUpload, messages]);

  const loadMoreMessages = async () => {
    if (!userId || !lastVisibleMessage || loadingMore) return;
  
    setLoadingMore(true);
  
    const { messages: olderMessages, lastVisible } = await fetchMessagesByPage(userId, lastVisibleMessage);
  
    if (olderMessages.length > 0) {
      setMessages((prevMessages) => [...prevMessages, ...olderMessages]);
      setLastVisibleMessage(lastVisible); // Actualizar el último mensaje visible
    }
  
    setLoadingMore(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;

      if (chatContainerRef.current.scrollTop === 0) {
        loadMoreMessages(); // Cargar más mensajes si está en la parte superior
      }
    };

    const container = chatContainerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [userId, lastVisibleMessage]);


  const handleSendMessage = async (message: string, imageFile?: File) => {
    let imageUrl = "";
    if (userId) {
      if (imageFile) {
        setLoadingImgUpload(true);

        const imgResult = await uploadToCloudinary(imageFile);

        if (imgResult) {
          imageUrl = imgResult;
        }
        setLoadingImgUpload(false);
      }

      if (imageFile && imageUrl.length == 0) {
        showSnackbar("We have problems to upload the selected image, please try again", "error");
        return;
      }

      await sendMessage(userId, message, imageUrl);
    }
  };

  // Agrupar mensajes por fecha
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
          <div 
            ref={chatContainerRef}
            className="flex-1 h-full overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {loadingMore && <div className="text-center text-gray-400">Loading messages...</div>}
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
                    onImageLoad={handleImageLoad}
                  />
                ))}
              </div>
            ))}
            {loadingImgUpload ? <MessageBubble text="" imageUrl="" isSender={true} timestamp={new Date()}></MessageBubble> : null}
            <div ref={chatEndRef} />
          </div>
          
          {/* Barra de entrada */}
          <InputBar onSend={handleSendMessage} />
        </>
      ) : (<LoadingPage />)}

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
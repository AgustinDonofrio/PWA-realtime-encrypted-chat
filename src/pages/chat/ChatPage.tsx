import React, { useState, useEffect, useRef, use } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import MessageBubble from "../../components/chat/MessageBubble";
import InputBar from "../../components/chat/InputBar";
import { getUserById, getUserToken } from "../../controllers/userController";
import { subscribeToMessages, sendMessage, updateMessageSendedState, sendMessageWithId } from "../../controllers/messageController";
import LoadingPage from "../loading/LoadingPage";
import { formatDate } from "../../helpers/utils";
import { uploadToCloudinary } from "../../controllers/cloudinaryController";
import Snackbar from "../../components/snackbar/Snackbar";
import { saveToIndexedDB, getFromIndexedDB, getFromIndexedDbById } from "../../controllers/indexDbHelpers";
import { MdOutlineSignalWifiConnectedNoInternet4 } from "react-icons/md"
import { auth } from "../../firebase/firebase.config";
import { sendMessageWithToken } from "../../controllers/pushNotificationController";

const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
  <div className="text-gray-400 text-sm text-center my-2">
    {date}
  </div>
);

interface ChatPageProps {
  userId?: string;
  callback?: (value: string) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ userId, callback }) => {
  const { userId: userIdFromParams } = useParams<{ userId: string }>();
  const finalUserId = userId || userIdFromParams; // Usa el de props (para mobile) o el de params (para desktop)
  const [messages, setMessages] = useState<{ id?: string, from?: string, to?: string, text?: string; imageUrl?: string; videoUrl?: string, isSender: boolean, timestamp: Date, sended?: boolean }[]>([]);
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


  if (finalUserId && callback) {
    useEffect(() => {
      callback(finalUserId);
    }, [finalUserId]);
  }

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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Obtener los datos del usuario con el que se está chateando
  useEffect(() => {
    if (!finalUserId) return;

    const fetchChatUser = async () => {
      try {
        let userData: any
        if (navigator.onLine) {
          userData = await getUserById(finalUserId);
        } else {
          userData = await getFromIndexedDbById("contacts", finalUserId);
        }

        if (userData) {
          setChatUser({
            name: userData.name,
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
  }, [finalUserId]);

  // Obtener mensajes en tiempo real
  useEffect(() => {
    if (!finalUserId) return;

    // Limpiar los mensajes antes de cargar los nuevos
    setMessages([]);

    const fetchMessages = async () => {
      if (!navigator.onLine) {
        // Obtener mensajes de IndexedDB
        const allMessages = await getFromIndexedDB("messages");

        // Filtrar mensajes por el userId correspondiente
        const filteredMessages = allMessages.filter((msg) => msg.from === finalUserId || msg.to === finalUserId);

        filteredMessages.sort((a, b) => a.timestamp - b.timestamp);

        setMessages(filteredMessages);
      }
    }

    if (!navigator.onLine) {
      fetchMessages().then(() => { setLoading(false); });
    }


    const unsubscribe = subscribeToMessages(finalUserId, async (newMessages) => {

      for (const newMsg of newMessages) {

        saveToIndexedDB("messages", newMsg)

        if (!newMsg.sended && navigator.onLine) {
          const updateResponse = await updateMessageSendedState(newMsg.id);
          newMsg.sended = updateResponse.success;
        }
      }

      if (navigator.onLine) {
        if (newMessages.length > 0) {
          setLastVisibleMessage(newMessages[newMessages.length - 1]);
          setMessages((prevMessages) => {
            const mergedMessages = [...prevMessages, ...newMessages];

            // Eliminar duplicados basados en el ID del mensaje
            const uniqueMessages = Array.from(new Map(mergedMessages.map(msg => [msg.id, msg])).values());

            return uniqueMessages.sort((a, b) => a.timestamp - b.timestamp);
          });
        }
      } else {
        fetchMessages();
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [finalUserId]);

  useEffect(() => {
    const handleOnline = async () => {
      if (navigator.onLine && finalUserId) {
        // Verificar y actualizar el estado de los mensajes no enviados
        let lastMessageSended = "";
        let isFileMessage = false;
        let messageSended = false;
        const unsentMessages = messages.filter((msg) => !msg.sended && msg.sended !== undefined);

        for (const msg of unsentMessages) {
          if (msg.id) {
            const response = await sendMessageWithId(msg.id, finalUserId, msg.text, msg.imageUrl, msg.videoUrl)

            if (response.success) {
              messageSended = true;
              isFileMessage = msg.imageUrl || msg.videoUrl ? true : false;

              if (!isFileMessage) {
                lastMessageSended = msg.text || "";
              }
            }
          }
        }
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //Scroll para carga inicial de imagen
  useEffect(() => {
    if (loadingImgUpload) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loadingImgUpload, messages]);

  const handleSendMessage = async (message: string, fileToUpload?: File) => {
    let fileUrl = "";
    let isVideoFile = false;
    if (finalUserId) {
      if (fileToUpload) {

        if (!fileToUpload.type.startsWith("video/") && !fileToUpload.type.startsWith("image/")) {
          return showSnackbar("Invalid file selected", "error")
        }

        setLoadingImgUpload(true);
        isVideoFile = fileToUpload.type.startsWith("video/");
        const fileResult = await uploadToCloudinary(fileToUpload);

        if (fileResult) {
          fileUrl = fileResult;
        }
        setLoadingImgUpload(false);
      }

      if (fileToUpload && fileUrl.length == 0) {

        if (navigator.onLine) {
          showSnackbar("We have problems to send the selected image, please try again", "error");
        } else {
          showSnackbar("You don't have an internet connection, try again later", "error")
        }

        return;
      }

      const sendResponse = await sendMessage(finalUserId, message, fileUrl, isVideoFile);

      if (sendResponse.success) {
        const userToken = await getUserToken(finalUserId);
        if (userToken) {

          const userData = await getUserById(auth.currentUser?.uid || "");

          if (userData) {
            const messageNotification = {
              notification: {
                title: `New message from ${userData.name}` || "New message",
                body: message,
              },
              data: {
                isFileMessage: fileToUpload,
                senderId: auth.currentUser?.uid,
              }
            }

            await sendMessageWithToken(userToken, messageNotification);
          }
        }

      }
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
            {!navigator.onLine && !loading && messages.length == 0 && <div className="text-center text-error-red justify-items-center"><span className="flex flex-row gap-3 items-center"><MdOutlineSignalWifiConnectedNoInternet4 /> You don't have an internet connection, try again later</span></div>}
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>
                {/* Fecha como separador */}
                <DateSeparator date={date} />
                {messages.map((msg, index) => {
                  return (
                    <MessageBubble
                      key={index}
                      text={msg.text}
                      imageUrl={msg.imageUrl}
                      videoUrl={msg.videoUrl}
                      isSender={msg.isSender}
                      timestamp={msg.timestamp}
                      withConnection={msg.isSender ? msg.sended : true}
                      onImageLoad={handleImageLoad}
                    />
                  )
                })}
              </div>
            ))}
            {loadingImgUpload ? <MessageBubble text="" imageUrl="" videoUrl="" isSender={true} timestamp={new Date()} withConnection={true}></MessageBubble> : null}
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
          duration={5000}
        />
      )}
    </div>
  );
};

export default ChatPage;
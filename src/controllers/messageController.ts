import { db, auth } from "../firebase/firebase.config";
import {
  doc,
  getDocs,
  addDoc,
  setDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
  where,
  limit,
  or,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  mapAuthCodeToMessage,
  encryptMessage,
  decryptMessage,
} from "../helpers/utils";

const storage = getStorage();

export const uploadImage = async (
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
) => {
  try {
    if (!auth.currentUser?.uid) {
      throw new Error("User is not authenticated");
    }

    const filePath = `${folder}/${auth.currentUser.uid}-${Date.now()}-${
      file.name
    }`;
    const storageRef = ref(storage, filePath);

    // Subir la imagen con un controlador de progreso
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calcular el progreso y llamar al callback
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress); // Actualizar el progreso
        },
        (error) => {
          console.error("Error uploading image:", error);
          reject(error);
        },
        async () => {
          // Obtener la URL de descarga cuando se complete la subida
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const subscribeToMessages = (
  userId: string,
  callback: (param: any) => any
) => {
  try {
    if (!auth.currentUser?.uid) {
      return { success: false, message: "Message cannot be received" };
    }

    const messagesRef = collection(db, "messages");

    // Configurar la consulta
    const q = query(
      messagesRef,
      where("to", "in", [auth.currentUser?.uid, userId]),
      where("from", "in", [auth.currentUser?.uid, userId]),
      orderBy("creationDate", "asc")
    );

    // Escuchar los cambios en tiempo real
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          text: data.text ? decryptMessage(data.text) : "",
          imageUrl: data.imageUrl ? decryptMessage(data.imageUrl) : null,
          videoUrl: data.videoUrl ? decryptMessage(data.videoUrl) : null,
          isSender: data.from === auth.currentUser?.uid, // Verificar si el mensaje fue enviado por el usuario actual
          timestamp: data.creationDate?.toDate() || new Date(), // Convertir Timestamp a Date
          sended: data.sended == undefined ? true : data.sended,
          from: data.from,
          to: data.to,
          read: false, // Marcar como no leído por defecto
        };
      });

      callback(newMessages); // Llamar al callback con los mensajes
    });

    // Retornar la función para desuscribirse
    return unsubscribe;
  } catch (err: any) {
    return {
      success: false,
      message: mapAuthCodeToMessage(err.code),
    };
  }
};

export const subscribeToLastMessages = (
  userId: string,
  callback: (messages: any[]) => void
) => {
  if (!userId) return () => {};

  const messagesRef = collection(db, "messages");

  const messagesQuery = query(
    messagesRef,
    or(where("to", "==", userId), where("from", "==", userId)), // Ahora escucha tanto enviados como recibidos
    orderBy("creationDate", "desc"),
    limit(1)
  );

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.text) data.text = decryptMessage(data.text);

      if (data.imageUrl) data.imageUrl = decryptMessage(data.imageUrl);

      if (data.videoUrl) data.videoUrl = decryptMessage(data.videoUrl);

      return {
        id: doc.id,
        creationDate: data.creationDate?.toDate() || new Date(),
        ...data,
      };
    });
    callback(messages);
  });

  return unsubscribe;
};

export const sendMessage = async (
  toUser: string,
  message?: string,
  fileUrl?: string,
  isVideoFile?: boolean
) => {
  try {
    if (!auth.currentUser?.uid) {
      return { success: false, message: "Message cannot be sent" };
    }

    if (message) {
      message = encryptMessage(message);
    }

    if (fileUrl) {
      fileUrl = encryptMessage(fileUrl);
    }

    const messagesRef = collection(db, "messages");

    const newMessage = {
      from: auth.currentUser?.uid,
      to: toUser,
      text: message || null,
      imageUrl: isVideoFile ? null : fileUrl || null,
      videoUrl: isVideoFile ? fileUrl || null : null,
      creationDate: Timestamp.now(),
      sended: navigator.onLine,
      read: false,
    };

    // Guardar el mensaje en Firestore
    await addDoc(messagesRef, newMessage);

    return { success: true, message: "Message sent" };
  } catch (error: any) {
    console.error("Error sending message:", error);
    return {
      success: false,
      message: mapAuthCodeToMessage(error.code),
    };
  }
};

export const sendMessageWithId = async (
  messageId: string,
  toUser: string,
  message?: string,
  imageUrl?: string,
  videoUrl?: string
) => {
  try {
    if (!auth.currentUser?.uid) {
      return { success: false, message: "Message cannot be sent" };
    }

    if (message) {
      message = encryptMessage(message);
    }

    if (imageUrl) {
      imageUrl = encryptMessage(imageUrl);
    }

    if (videoUrl) {
      videoUrl = encryptMessage(videoUrl);
    }

    const messagesRef = collection(db, "messages");

    const newMessage = {
      from: auth.currentUser?.uid,
      to: toUser,
      text: message || null,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      creationDate: Timestamp.now(),
      sended: navigator.onLine,
      read: false,
    };

    // Usamos setDoc para establecer el documento con un ID personalizado
    await setDoc(doc(messagesRef, messageId), newMessage);

    return { success: true, message: "Message sent" };
  } catch (error: any) {
    console.error("Error sending message:", error);
    return {
      success: false,
      message: mapAuthCodeToMessage(error.code),
    };
  }
};

export const getLastMessage = async (contactId: string) => {
  try {
    if (!auth.currentUser?.uid) {
      throw new Error("User is not authenticated");
    }

    if (!contactId) {
      console.error("Contact ID is required");
      return null;
    }

    const messagesRef = collection(db, "messages");

    const q = query(
      messagesRef,
      where("to", "in", [auth.currentUser.uid, contactId]),
      where("from", "in", [auth.currentUser.uid, contactId]),
      orderBy("creationDate", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const lastMessage = querySnapshot.docs[0].data();
    return {
      text: lastMessage.text ? decryptMessage(lastMessage.text) : "",
      isFile: lastMessage.isFile || false,
      creationDate: lastMessage.creationDate?.toDate() || new Date(),
      from: lastMessage.from,
      to: lastMessage.to,
    };
  } catch (error) {
    console.error("Error fetching last message:", error);
    return null;
  }
};

export const getMessagesByUser = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const messagesRef = collection(db, "messages");

    // Crear las condiciones `where` para "to" y "from"
    const toCondition = where("to", "==", userId);
    const fromCondition = where("from", "==", userId);

    // Combinar las condiciones con `or`
    const q = query(messagesRef, or(toCondition, fromCondition));

    const querySnapshot = await getDocs(q);

    const messages = querySnapshot.docs.map((doc) => doc.data());
    return messages;
  } catch (error) {
    console.error("Error fetching messages by user:", error);
    return [];
  }
};

export const updateMessageSendedState = async (docId: string) => {
  try {
    await updateDoc(doc(db, "messages", docId), {
      sended: true,
    });

    return { success: true, message: "Message updated" };
  } catch (err: any) {
    return { success: false, message: "Message cannot be updated" };
  }
};

export const subscribeToUnreadMessages = (
  currentUserId: string,
  callback: (unreadCounts: { [chatId: string]: number }) => void
) => {
  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("to", "==", currentUserId),
    where("read", "==", false)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const counts: { [chatId: string]: number } = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      const chatId = data.from;
      counts[chatId] = (counts[chatId] || 0) + 1;
    });
    callback(counts);
  });

  return unsubscribe;
};

export const markMessagesAsRead = async (contactId: string) => {
  if (!auth.currentUser?.uid) return;
  
  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("to", "==", auth.currentUser.uid),
    where("from", "==", contactId),
    where("read", "==", false)
  );

  const snapshot = await getDocs(q);
  snapshot.forEach(async (docSnap) => {
    await updateDoc(doc(db, "messages", docSnap.id), { read: true });
  });
};
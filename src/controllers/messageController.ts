import { db, auth } from "../firebase/firebase.config";
import {
  doc,
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { mapAuthCodeToMessage } from "../helpers/utils";

const storage = getStorage();

export const uploadImage = async (file: File, folder: string, onProgress?: (progress: number) => void) => {
  try {
    if (!auth.currentUser?.uid) {
      throw new Error("User is not authenticated");
    }

    const filePath = `${folder}/${auth.currentUser.uid}-${Date.now()}-${file.name}`;
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
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          text: data.text || "",
          imageUrl: data.imageUrl || null,
          isSender: data.from === auth.currentUser?.uid, // Verificar si el mensaje fue enviado por el usuario actual
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

export const sendMessage = async (toUser: string, message?: string, imageUrl?: string) => {
  try {
    if (!auth.currentUser?.uid) {
      return { success: false, message: "Message cannot be sent" };
    }

    const messagesRef = collection(db, "messages");

    const newMessage = {
      from: auth.currentUser?.uid,
      to: toUser,
      text: message || null,
      imageUrl: imageUrl || null,
      creationDate: Timestamp.now(),
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

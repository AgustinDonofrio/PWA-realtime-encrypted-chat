import { db, auth } from "../firebase/firebase.config";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  getDocs,
  onSnapshot,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { mapAuthCodeToMessage } from "../helpers/utils";

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
          text: data.text,
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

export const sendMessage = async (toUser: string, message: string) => {
  try {
    if (!auth.currentUser?.uid) {
      return { success: false, message: "Message cannot be sended" };
    }

    const messagesRef = collection(db, "messages");

    const newMessage = {
      from: auth.currentUser?.uid,
      to: toUser,
      text: message,
      creationDate: Timestamp.now(),
    };

    // Guardar el mensaje en Firestore
    await addDoc(messagesRef, newMessage);

    return { success: true, message: "Message sended" };
  } catch (error: any) {
    console.error("Error sending message:", error);
    return {
      success: false,
      message: mapAuthCodeToMessage(error.code),
    };
  }
};

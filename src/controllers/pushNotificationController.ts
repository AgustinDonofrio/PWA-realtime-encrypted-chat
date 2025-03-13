import { getToken, onMessage, deleteToken } from "firebase/messaging";
import { messaging } from "../firebase/firebase.config";
import { updateUserToken } from "./userController";
import axios from "axios";

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

interface NotificationFormat {
  title: string;
  body: string;
}

interface PayloadFormat {
  notification: NotificationFormat;
  data: any;
}

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Permiso de notificaciones:", permission);

    if (permission === "granted") {
      console.log("Permiso de notificaciones concedido");

      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      console.log("FCM Token:", token);

      //Actualizar el token del usuario en la base de datos
      await updateUserToken(token);

      return token;
    } else {
      console.log("Permiso de notificaciones denegado");
    }
  } catch (error) {
    console.error("Error obteniendo el token", error);
  }
};

export const onMessageListener = (callback: (payload: any) => void) => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Notificación recibida en foreground:", payload);
      callback(payload);
    });
  });
};

export const sendMessageWithToken = async (
  token: string,
  payload: PayloadFormat
) => {
  try {
    const message = {
      message: {
        token: token,
        ...payload,
      },
    };

    const response = await axios(
      `${import.meta.env.VITE_FIREBASE_TOKEN_GENERATOR}/firebase/send_message`,
      {
        method: "POST",
        data: message,
      }
    );

    if (response.status >= 300) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error enviando mensaje con token:", error);
    return false;
  }
};

export const deleteUserToken = async () => {
  try {
    await deleteToken(messaging);
    const updateResponse = updateUserToken(""); // Actualizar el token del usuario a una cadena vacía

    if (!updateResponse) {
      return false;
    }

    localStorage.removeItem("fcmToken");

    return true;
  } catch (error) {
    console.error("Error deleting user token:", error);
    return false;
  }
};

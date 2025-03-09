import { getToken, onMessage } from "firebase/messaging";
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

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Notificación recibida en foreground:", payload);
      resolve(payload);
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

    console.log(message);

    const response = await axios(
      `https://fcm.googleapis.com/v1/projects/${
        import.meta.env.VITE_FIREBASE_PROJECT_ID
      }/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_FIREBASE_ACCESS_TOKEN}`,
        },
        data: JSON.stringify(message),
      }
    );

    const responseData = response.data;
    console.log("Respuesta de FCM:", responseData);

    return responseData;
  } catch (error) {
    console.error("Error enviando mensaje con token:", error);
    return false;
  }
};

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

    const accessToken = await getFirebaseAccessToken();
    console.log(accessToken);

    if (!accessToken) {
      return false;
    }

    const response = await axios(
      `https://fcm.googleapis.com/v1/projects/${
        import.meta.env.VITE_FIREBASE_PROJECT_ID
      }/messages:send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: JSON.stringify(message),
      }
    );

    console.log("Respuesta de FCM 1:", response);

    const responseData = response.data;
    console.log("Respuesta de FCM 2:", responseData);

    return responseData;
  } catch (error) {
    console.error("Error enviando mensaje con token:", error);
    return false;
  }
};

const getFirebaseAccessToken = async () => {
  try {
    const response = await axios(
      `${import.meta.env.VITE_FIREBASE_TOKEN_GENERATOR}/firebase/access_token`
    );

    if (response.status === 200) {
      const data = response.data;
      return data.data;
    }

    return null;
  } catch (error) {
    console.error("Error obteniendo el token de acceso de Firebase", error);

    return null;
  }
};

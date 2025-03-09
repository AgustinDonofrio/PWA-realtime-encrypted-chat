import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase/firebase.config";

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Permiso de notificaciones:", permission);

    if (permission === "granted") {
      console.log("Permiso de notificaciones concedido");

      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      console.log("FCM Token:", token);

      return token;
    } else {
      console.log("Permiso de notificaciones denegado");
    }
  } catch (error) {
    console.error("Error obteniendo el token", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Notificación recibida en foreground:", payload);
      resolve(payload);
    });
  });

importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

const app = firebase.initializeApp({
  apiKey: "AIzaSyBktnTI94scE42tEOn99ZX8G0d06UI-8lM",
  authDomain: "pwa-realtime-encrypted-chat-v2.firebaseapp.com",
  projectId: "pwa-realtime-encrypted-chat-v2",
  storageBucket: "pwa-realtime-encrypted-chat-v2.firebasestorage.app",
  messagingSenderId: "840323801977",
  appId: "1:840323801977:web:5b2fe2377ac6a5703585a8",
  measurementId: "G-H84GS48NSW",
});

const messaging = firebase.messaging(app);

messaging.onBackgroundMessage((payload) => {
  console.log("Notificación recibida en background:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    data: { senderId, isFileMessage },
    icon: "/icon-192x192.png",
  });
});

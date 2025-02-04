import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import { AuthProvider } from "./context/AuthContext";
import "./styles/index.css";
import { registerSW } from "virtual:pwa-register";

// Obtén el elemento raíz del DOM
const rootElement = document.getElementById("root");


if (!rootElement) {
    throw new Error("No se encontró el elemento root en el HTML");
}

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("Nueva versión disponible. ¿Recargar?")) {
            window.location.reload();
        }
    },
    onOfflineReady() {
        console.log("La aplicación está lista para usarse sin conexión.");
    },
});

// Crea la raíz para React
const root = ReactDOM.createRoot(rootElement);

// Renderiza el componente App
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);

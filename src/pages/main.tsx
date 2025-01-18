import React from "react";
import ReactDOM from "react-dom/client"; // Nota: Aquí se importa `react-dom/client`
import * as authController from "../controllers/authController.ts"
import App from "./App.tsx";
import { AuthProvider } from "../context/AuthContext";
import "../styles/index.css";

// Obtén el elemento raíz del DOM
const rootElement = document.getElementById("root");


if (!rootElement) {
    throw new Error("No se encontró el elemento root en el HTML");
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log(navigator)
        navigator.serviceWorker.register('/service-worker.js').then(
            (registration) => {
                console.log('Service Worker registrado:', registration);
            },
            (error) => {
                console.error('Error al registrar el Service Worker:', error);
            }
        );
    });
}

//authController.createUser({ name: "Mauricio Giaco", email: "test@test.com", password: "test1234" }).then(response => console.log("Response ->", response)).finally(() => console.log("Termine :p"));

authController.createUser({ name: "Mauricio Giaco", email: "test@test.com", password: "test1234" })
    .then(response => {
        if (!response.success && response.msg.includes("auth/email-already-in-use")) {
            console.log("El usuario ya existe, intentando iniciar sesión...");
            return authController.loginUser({ name: "Mauricio Giaco", email: "test@test.com", password: "test1234" });
        }
        return response;
    })
    .then(response => console.log("Login/Create Response ->", response))
    .catch(err => console.error("Error ->", err));


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

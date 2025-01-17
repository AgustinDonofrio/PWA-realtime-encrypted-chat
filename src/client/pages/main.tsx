import React from "react";
import ReactDOM from "react-dom/client"; // Nota: Aquí se importa `react-dom/client`
import * as usersController from "../controllers/users_controller.ts"
import App from "./App.tsx";
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

usersController.createUser({ name: "Mauricio Giaco", email: "mauriciogiaco@gmail.com", password: "12321414512" }).then(response => console.log("RESPONSEEEE", response)).finally(() => console.log("Termine :p"));

// Crea la raíz para React
const root = ReactDOM.createRoot(rootElement);

// Renderiza el componente App
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

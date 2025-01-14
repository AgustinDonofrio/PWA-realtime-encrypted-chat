import React from "react";
import ReactDOM from "react-dom/client"; // Nota: Aquí se importa `react-dom/client`
import App from "./App.tsx";
import "../styles/index.css";

// Obtén el elemento raíz del DOM
const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("No se encontró el elemento root en el HTML");
}

// Crea la raíz para React
const root = ReactDOM.createRoot(rootElement);

// Renderiza el componente App
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

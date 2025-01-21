import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

interface SnackbarProps {
    message: string;
    duration?: number;
    onClose: () => void;
    type?: 'success' | 'error' | 'info'; // Puedes definir diferentes tipos de mensajes
}

const Snackbar: React.FC<SnackbarProps> = ({ message, duration = 3000, onClose, type = 'info' }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const getSnackbarClass = () => {
        switch (type) {
            case 'success':
                return 'bg-royal-blue';
            case 'error':
                return 'bg-error-red';
            case 'info':
                return 'bg-steel';
            default:
                return 'bg-light-gray'; // Default: gris
        }
    };

    const bgColor =
        type === "success"
            ? "bg-green-500"
            : type === "error"
                ? "bg-red-500"
                : "bg-blue-500";


    return (
        <div
            className={
                `fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-xs p-4 text-white rounded-lg shadow-md transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0 translate-y-4"} ${bgColor}`
            }
            style={{ transition: "opacity 0.3s ease, transform 0.3s ease" }}
        >
            <div className="flex items-center justify-between">
                <span>{message}</span>
                <button onClick={onClose} className="ml-2 p-1">
                    <IoMdClose className="h-5 w-5 text-white" />
                </button>
            </div>
        </div>
    );
};

export default Snackbar;

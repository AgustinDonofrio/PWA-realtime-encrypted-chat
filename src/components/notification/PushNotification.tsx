
import React from 'react';
import { FaCamera } from 'react-icons/fa';

interface PushNotificationProps {
    title: string;
    message: string;
    isFile?: boolean;
    icon?: string;
}

const PushNotification: React.FC<PushNotificationProps> = ({ title, message, isFile, icon }) => {
    return (<div className="absolute m-auto z-50 left-0 right-0 top-3 text-center w-11/12 bg-white p-2 rounded-lg">
        <div>
            {icon ? <img src={icon}
                className="w-12 h-12 rounded-full m-auto" alt="icon" /> : null}
            <h2>{title}</h2>
            <p>{isFile ? <FaCamera></FaCamera> : message}</p>
        </div>

    </div>)
}

export default PushNotification;

import React from 'react';
import { FaCamera, FaUser } from 'react-icons/fa';

interface PushNotificationProps {
    title: string;
    message: string;
    isFile?: boolean;
}

const PushNotification: React.FC<PushNotificationProps> = ({ title, message, isFile }) => {

    return (<div className="absolute m-auto z-50 left-0 right-0 top-3 h-[72px] text-center max-w-[90%] w-max bg-royal-blue p-3 rounded-lg">

        <div className='flex w-full max-h-full justify-center gap-3'>
            <div className="relative w-12 h-12 min-w-12 min-h-12 rounded-full flex items-center justify-center">
                <img
                    src="icon-192x192.png"
                    alt={""}
                    className="w-12 h-12 rounded-full"
                />
            </div>

            <div className='justify-items-center line-clamp-3 max-h-full'>
                <h1 className="truncate text-lg font-semibold max-w-full">{title}</h1>
                <p className="truncate max-w-full">{isFile ? <FaCamera></FaCamera> : message}</p>
            </div>

        </div>

    </div>)
}

export default PushNotification;
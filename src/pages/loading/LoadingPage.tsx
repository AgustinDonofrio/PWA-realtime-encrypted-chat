import React from "react";
import Spinner from "../../components/spinner/Spinner";

const LoadingPage: React.FC = () => {
    return (
        <div className="flex h-full items-center justify-center min-h-screen bg-main-color px-4">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                <Spinner message="Loading..."/>
            </div>
        </div>
    );
};

export default LoadingPage;
import React from "react";
import { ClipLoader } from "react-spinners";

interface SpinnerProps {
  size?: number;
  color?: string;
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 45,
  color = "#1466B8", // royal-blue
  message,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ClipLoader size={size} color={color} speedMultiplier={0.8} />
      {message && <p className="mt-2 text-gray-700">{message}</p>}
    </div>
  );
};

export default Spinner;
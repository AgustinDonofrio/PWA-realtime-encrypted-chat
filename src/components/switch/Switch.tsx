import React from "react";

interface SwitchProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ isEnabled, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(!isEnabled)}
      className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${isEnabled ? "bg-royal-blue" : "bg-disabled-gray"
        }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isEnabled ? "translate-x-7" : "translate-x-0"
          }`}
      ></div>
    </button>
  );
};

export default Switch;

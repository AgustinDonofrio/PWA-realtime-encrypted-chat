import React from "react";

interface InputProps {
  type: string;
  id: string;
  placeholder: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ type, id, placeholder, className }) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="w-full px-4 py-4 text-light-gray bg-steel focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
      />
    </div>
  );
};

export default Input;
import React from "react";
import { FiSettings } from "react-icons/fi";

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-main-color border-b border-gray-700">
      <h1 className="text-white text-xl font-semibold flex-grow text-center">APP NAME</h1>
      <FiSettings className="text-white text-2xl cursor-pointer" />
    </div>
  );
};

export default Header;
import React from "react";

const SearchBar: React.FC = () => {
  return (
    <div className="p-3">
      <input
        type="text"
        placeholder="Search contacts"
        className="w-full p-3 rounded-lg bg-steel text-white text-sm focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
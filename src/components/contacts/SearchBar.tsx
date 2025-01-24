import React from "react";

interface SearchBarProps {
  onSearch: (text: string) => void; // Función para manejar el texto de búsqueda
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className="m-4">
      <input
        type="text"
        placeholder="Search contacts"
        className="w-full p-3 rounded-lg bg-steel text-white text-sm focus:outline-none"
        onChange={(e) => onSearch(e.target.value)} // Llamar a la función al cambiar el texto
      />
    </div>
  );
};

export default SearchBar;
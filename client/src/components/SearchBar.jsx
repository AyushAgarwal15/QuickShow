import React from "react";
import { SearchIcon, XIcon } from "lucide-react";

const SearchBar = ({ value, onChange, onClose, placeholder = "Search...", className = "" }) => {
  return (
    <div
      className={`relative flex items-center bg-white/10 border border-gray-300/20 px-3 py-1 rounded-full overflow-hidden ${className}`}
    >
      <SearchIcon className="w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none ml-2 text-sm text-white placeholder-gray-400 min-w-0"
      />
      {onClose && (
        <XIcon
          className="w-4 h-4 ml-2 text-gray-400 cursor-pointer hover:text-white"
          onClick={onClose}
        />
      )}
    </div>
  );
};

export default SearchBar; 
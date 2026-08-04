import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search receipts...",
  autoFocus = false,
  disabled = false,
}) => {
  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    const query = value.trim();

    if (!query) return;

    onSearch(query);
  };

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          py-3
          pl-11
          pr-4
          text-sm
          text-gray-900
          placeholder:text-gray-400
          outline-none
          transition-all
          duration-200
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      />
    </div>
  );
};

export default SearchBar;
import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search receipts...",
  autoFocus = false,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const query = value.trim();

    if (!query) return;

    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="
          flex
          items-center
          gap-4
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-5
          py-4
          shadow-sm
          transition-all
          duration-200
          focus-within:border-blue-500
          focus-within:ring-4
          focus-within:ring-blue-100
        "
      >
        {/* Search Icon */}
        <Search
          size={20}
          className="text-slate-400"
        />

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="
            flex-1
            bg-transparent
            text-base
            text-slate-900
            placeholder:text-slate-400
            outline-none
          "
        />

        {/* Enter Key */}
        <div
          className="
            hidden
            items-center
            gap-1
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            px-3
            py-1.5
            text-xs
            font-medium
            text-slate-500
            md:flex
          "
        >
          <kbd>↵</kbd>
          <span>Enter</span>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
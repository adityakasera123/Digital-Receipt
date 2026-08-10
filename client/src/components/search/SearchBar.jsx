import { Search } from 'lucide-react';

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search receipts...',
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
      <div className='flex items-center gap-4 rounded-3xl border border-default bg-surface px-6 py-4 shadow-sm transition-theme focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10'>
        {/* Search Icon */}
        <Search
          size={24}
          className='text-secondary'
        />

        {/* Input */}
        <input
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className='flex-1 bg-transparent text-base text-primary placeholder:text-secondary outline-none'
        />

        {/* Enter Key */}
        <div className='hidden items-center gap-1 rounded-lg border border-default bg-surface-secondary px-3 py-1.5 text-xs font-medium text-secondary md:flex'>
          <kbd>↵</kbd>
          <span>Enter</span>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
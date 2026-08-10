const sortOptions = [
  {
    value: 'newest',
    label: 'Newest',
  },
  {
    value: 'oldest',
    label: 'Oldest',
  },
  {
    value: 'highest',
    label: 'Highest Amount',
  },
  {
    value: 'lowest',
    label: 'Lowest Amount',
  },
];

const SearchSort = ({ sortBy, onSortChange }) => {
  return (
    <div className='flex items-center gap-3'>
      <span className='text-sm font-medium text-secondary'>
        Sort By
      </span>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className='rounded-xl border border-default bg-surface px-4 py-2 text-sm text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
      >
        {sortOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchSort;
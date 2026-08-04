const sortOptions = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "oldest",
    label: "Oldest",
  },
  {
    value: "highest",
    label: "Highest Amount",
  },
  {
    value: "lowest",
    label: "Lowest Amount",
  },
];

const SearchSort = ({ sortBy, onSortChange }) => {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-slate-600">
        Sort By
      </label>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          py-2
          text-sm
          text-slate-700
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
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
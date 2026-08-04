const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Groceries",
  "Food",
  "Travel",
];

const SearchFilters = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {categories.map((category) => {
        const active = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              rounded-full
              px-4
              py-2
              text-sm
              font-medium
              transition-all
              duration-200
              ${
                active
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default SearchFilters;
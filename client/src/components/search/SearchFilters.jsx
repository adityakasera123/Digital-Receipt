const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Groceries',
  'Food',
  'Travel',
];

const SearchFilters = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className='flex flex-wrap gap-3'>
      {categories.map((category) => {
        const active = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-blue-600 text-white shadow-md'
                : 'border border-default bg-surface text-primary hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default SearchFilters;
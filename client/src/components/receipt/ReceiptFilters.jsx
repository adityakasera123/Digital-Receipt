function ReceiptFilters({
  activeCategory,
  setActiveCategory,
}) {
  const categories = [
    'All',
    'Electronics',
    'Fashion',
    'Food',
    'Travel',
    'Home',
    'Others',
  ];

  return (
    <div className='flex flex-wrap gap-3'>
      {categories.map((category) => {
        const active = activeCategory === category;

        return (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-theme ${
              active
                ? 'button-primary'
                : 'button-secondary'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default ReceiptFilters;
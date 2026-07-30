function ReceiptFilters({
  activeCategory,
  setActiveCategory,
}) {
  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Food",
    "Travel",
    "Home",
    "Others",
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
            activeCategory === category
              ? "bg-blue-600 text-white shadow-md"
              : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default ReceiptFilters;
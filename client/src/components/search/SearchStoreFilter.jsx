const SearchStoreFilter = ({
  stores,
  selectedStore,
  onStoreChange,
}) => {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="store-filter"
        className="text-sm font-medium text-secondary"
      >
        Store
      </label>

      <select
        id="store-filter"
        value={selectedStore}
        onChange={(e) => onStoreChange(e.target.value)}
        className="rounded-xl border border-default bg-surface px-4 py-2 text-sm text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      >
        <option value="All">All Stores</option>

        {stores.map((store) => (
          <option key={store} value={store}>
            {store}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchStoreFilter;